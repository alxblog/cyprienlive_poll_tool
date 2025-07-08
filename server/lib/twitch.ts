import {
	exchangeCode,
	getTokenInfo,
	RefreshingAuthProvider,
} from "@twurple/auth";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { ApiClient } from "@twurple/api";
import fs from "fs";
import path from "path";
import "dotenv/config";

interface TwitchClientConfig {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	scope: string;
	tokenPath: string;
}

export class TwitchClient {
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;
	private scope: string;
	private tokenPath: string;

	private authProvider!: RefreshingAuthProvider;
	private apiClient!: ApiClient;
	private userId!: string;
	private watchdogInterval?: NodeJS.Timeout;


	constructor(config: TwitchClientConfig) {
		this.clientId = config.clientId;
		this.clientSecret = config.clientSecret;
		this.redirectUri = config.redirectUri;
		this.scope = config.scope;
		this.tokenPath = config.tokenPath;
	}

	generateAuthLink(): string {
		const url = new URL("https://id.twitch.tv/oauth2/authorize");
		url.searchParams.append("client_id", this.clientId);
		url.searchParams.append("redirect_uri", this.redirectUri);
		url.searchParams.append("response_type", "code");
		url.searchParams.append("scope", this.scope);
		return url.toString();
	}


	/**
 * Démarre un watchdog pour maintenir le token actif.
 * Appelle getUserById(this.userId) toutes les X minutes.
 */
public startWatchdog(intervalMs: number = 1000 * 60 * 30): void {
  if (!this.apiClient || !this.userId) {
    console.warn("⚠️ Watchdog non démarré : client Twitch non initialisé.");
    return;
  }

  // Nettoie si déjà en cours
  if (this.watchdogInterval) {
    clearInterval(this.watchdogInterval);
  }

  this.watchdogInterval = setInterval(async () => {
    try {
      await this.apiClient.users.getUserById(this.userId);
      console.log("🔁 Watchdog : appel API OK → token vérifié");
    } catch (err) {
      console.error("❌ Watchdog : erreur lors de l’appel API", err);
    }
  }, intervalMs);

  console.log(`🕒 Watchdog lancé (intervalle = ${intervalMs / 60000} min)`);
}

	async init(): Promise<void> {
		if (!fs.existsSync(this.tokenPath)) {
			console.warn(
				"⚠️ Fichier token.json introuvable. Authentifiez-vous avec ce lien :"
			);
			console.log(this.generateAuthLink());
			return;
		}

		const tokenData = JSON.parse(fs.readFileSync(this.tokenPath, "utf-8"));
		this.authProvider = new RefreshingAuthProvider({
			clientId: this.clientId,
			clientSecret: this.clientSecret,
		});

		this.authProvider.onRefresh(async (userId, newTokenData) => {
			  console.log("🔁 Token rafraîchi pour", userId);
			this.saveToken(userId, newTokenData);
		});

		this.authProvider.addUser({ id: tokenData.userId }, tokenData);

		this.apiClient = new ApiClient({ authProvider: this.authProvider });

		const currentUser = await getTokenInfo(
			tokenData.accessToken,
			this.clientId
		);
		// const currentUser = await this.apiClient.users.getAuthenticatedUser();
		if (!currentUser.userId) {
			throw new Error(
				"L'utilisateur authentifié n'a pas d'ID utilisateur valide."
			);
		}
		this.userId = currentUser.userId;

		this.startWatchdog(); // Lance le watchdog

		console.log(
			`✅ Connecté en tant que : ${currentUser.userName} (${currentUser.userId})`
		);
	}

	/**
	 * Échange un code OAuth2 contre les tokens initiaux et les enregistre.
	 */
	public async exchangeCodeForToken(code: string): Promise<void> {
		try {
			const tokenData = await exchangeCode(
				this.clientId,
				this.clientSecret,
				code,
				this.redirectUri
			);
			console.log("✅ Tokens reçus depuis Twitch", tokenData);

			// Utiliser l'API pour obtenir l'utilisateur
			const tempProvider = new RefreshingAuthProvider({
				clientId: this.clientId,
				clientSecret: this.clientSecret,
			});

			await tempProvider.addUserForToken(tokenData);
			const tempClient = new ApiClient({ authProvider: tempProvider });

			const user = await getTokenInfo(tokenData.accessToken, this.clientId);
			if (!user)
				throw new Error("Impossible de récupérer l'utilisateur connecté");

			if (!user.userId) {
				throw new Error(
					"❌ Impossible de récupérer l'identifiant utilisateur (userId) depuis le token."
				);
			}
			this.saveToken(user.userId, tokenData);
			console.log(
				`🎉 Utilisateur authentifié : ${user.userName} (${user.userId})`
			);
		} catch (err) {
			console.error("❌ Échec de l'échange du code contre des tokens :", err);
		}
	}

	public async listModeratedChannels(): Promise<any[]> {
		console.log("Listings channels...");
		if (!this.apiClient || !this.userId) {
			throw new Error("Client non initialisé.");
		}

		try {
			const result = await this.apiClient.moderation.getModeratedChannels(
				this.userId
			);

			return result.data.map((channel) => ({
				displayName: channel.displayName,
				id: channel.id,
				name: channel.name,
			}));
		} catch (err) {
			console.error(
				"❌ Erreur lors de la récupération des chaînes modérées :",
				err
			);
			throw err;
		}
	}

	async publishPoll(broadcasterId: string, pollData: any): Promise<void> {
		if (!this.apiClient) throw new Error("Client non initialisé.");
		console.log("New poll publishing...");
		try {
			const { id, title } = await this.apiClient.polls.createPoll(
				broadcasterId,
				pollData
			);
			console.log(`📊 Sondage ${id} publié : ${title}`);
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Sauvegarde les données de token dans le fichier token.json
	 */
	public saveToken(userId: string, tokenData: any): void {
		try {
			const dataToSave = { userId, ...tokenData };
			// Vérifie si le dossier existe, sinon le crée
			const dir = path.dirname(this.tokenPath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			fs.writeFileSync(
				this.tokenPath,
				JSON.stringify(dataToSave, null, 2),
				"utf-8"
			);
			console.log("💾 Token enregistré avec succès.");
		} catch (err) {
			console.error("❌ Échec de l'écriture du fichier token.json :", err);
		}
	}

	/**
	 * Vérifie si un fichier de token existe.
	 * Utile pour conditionner l’affichage du lien d’auth.
	 */
	public hasToken(): boolean {
		try {
			return (
				fs.existsSync(this.tokenPath) && fs.statSync(this.tokenPath).isFile()
			);
		} catch {
			return false;
		}
	}

	startEventSub(): void {
		if (!this.apiClient || !this.userId) return;

		const listener = new EventSubWsListener({ apiClient: this.apiClient });

		listener.onChannelPollBegin(this.userId, (e) => {
			console.log("📢 Sondage lancé :", { title: e.title, id: e.id });
		});

		listener.onChannelPollProgress(this.userId, (e) => {
			console.log(
				"📈 Sondage en cours :",
				e.choices.map((c) => ({ title: c.title, votes: c.totalVotes }))
			);
		});

		listener.onChannelPollEnd(this.userId, (e) => {
			console.log("🏁 Sondage terminé :", {
				title: e.title,
				choices: e.choices,
			});
		});

		listener.onChannelFollow(this.userId, this.userId, (e) => {
			console.log("🎉 Nouveau follow :", e.userName);
		});

		listener.start();
		console.log("🟢 EventSub WebSocket démarré");
	}
}
