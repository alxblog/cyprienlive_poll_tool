# Étape 1 – Dépendances de développement
FROM node:22-alpine AS development-dependencies-env

RUN corepack enable && corepack prepare pnpm@latest --activate  # Active pnpm

COPY . /app
WORKDIR /app

RUN pnpm install

# Étape 2 – Dépendances de prod uniquement
FROM node:22-alpine AS production-dependencies-env

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY ./package.json ./pnpm-lock.yaml /app/
WORKDIR /app

RUN pnpm install --prod

# Étape 3 – Build React
FROM node:22-alpine AS build-env

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

RUN pnpm run build

# Étape finale – Serveur Express avec React build
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./server.js ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

CMD ["pnpm", "start"]
