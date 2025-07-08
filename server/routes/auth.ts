import { Router, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'
import { TwitchClient } from '../lib/twitch';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const broadcasterId = process.env.TWITCH_BROADCASTER_ID || ''
const scope = [
  'channel:read:polls',
  'channel:manage:polls',
  'chat:read',
  'chat:edit',
  'user:read:chat',
  'moderator:read:followers',
  'user:read:moderated_channels',
].join(' ')

console.log("App url:", process.env.APP_URL);


const twitchClient = new TwitchClient({
  clientId: process.env.TWITCH_CLIENT_ID!,
  clientSecret: process.env.TWITCH_CLIENT_SECRET!,
  redirectUri: new URL("/auth/callback", 
    process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : process.env.APP_URL).toString(),
  scope,
  tokenPath: path.resolve(__dirname, '..', 'data', 'token.json')
});

const authRouter = Router();

// Route GET /auth
authRouter.get('/', (req: Request, res: Response) => {
  res.send('Auth home');
});

// Route GET /auth/callback
authRouter.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).json({ error: 'Code OAuth manquant' });
    return;
  }

  try {
    await twitchClient.exchangeCodeForToken(code);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’échange du code', details: err });
  }
});

// Route GET /auth/setup
authRouter.get('/setup', (req: Request, res: Response) => {
   const url = twitchClient.generateAuthLink();
  res.json({ auth_url: url });
});

authRouter.get('/check', (req: Request, res: Response) => {
  res.json({ tokenExists: twitchClient.hasToken() });
});



// ✅ Route DELETE /auth/delete-token : supprime le fichier token.json
authRouter.get('/remove', (req: Request, res: Response) => {
  try {
    if (twitchClient.hasToken()) {
      fs.unlinkSync(twitchClient['tokenPath']);
      res.json({ removed: true });
    } else {
      res.json({ removed: false, message: 'Aucun token à supprimer' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du token', details: err });
  }
});

var jsonParser = bodyParser.json()

authRouter.get('/auth/force-refresh', async (req: Request, res: Response) => {
  try {
    const tokenPath = path.resolve(__dirname, '..', 'data', 'token.json');
    const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

    tokenData.expiresIn = 0; // Force l'expiration
    tokenData.obtainmentTimestamp = Date.now() - 3600 * 1000; // Simule une obtention ancienne

    fs.writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2), 'utf-8');

    res.status(200).json({ message: 'Token expiré forcé.' });
  } catch (err) {
    console.error('❌ Erreur dans /auth/force-refresh', err);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

authRouter.post('/publish_poll',jsonParser, async (req: Request, res: Response): Promise<void> => {
  const  pollData  = req.body;
  console.log("pollData", pollData);
  if ( !broadcasterId ||  !pollData) {
    res.status(400).json({ error: 'Paramètres manquants' });
    return;
  }

  try {
    await twitchClient.init();
    console.log('init passé');
    await twitchClient.publishPoll(broadcasterId, pollData);
    console.log('publishPoll passé');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la publication du sondage', details: err });
  }
});

authRouter.get('/moderatedchannels', async (req: Request, res: Response) => {
  try {
    console.log("init...");
    await twitchClient.init();
    const channels = await twitchClient.listModeratedChannels();
    res.json({ channels });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des chaînes modérées', details: err });
  }
});


export default authRouter;