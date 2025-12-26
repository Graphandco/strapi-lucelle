# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Arguments de build pour les variables d'environnement (ajoutez selon vos besoins)
# ARG DATABASE_HOST
# ARG DATABASE_NAME

# Convertir les ARG en ENV pour qu'elles soient disponibles au build Strapi
# ENV DATABASE_HOST=$DATABASE_HOST
# ENV DATABASE_NAME=$DATABASE_NAME

# Copier uniquement les fichiers de dépendances d'abord (cache Docker)
COPY package*.json ./
# Installer toutes les dépendances (y compris devDependencies)
# npm ci installe tout par défaut, pas besoin de --only
RUN npm ci

# Copier le reste du code source
COPY . .

# Build Strapi
RUN npm run build

# Runtime stage
FROM node:20-alpine

# Créer un utilisateur et un groupe non-root
RUN addgroup -S nodejs && adduser -S strapi -G nodejs

WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/types ./types
COPY --from=builder /app/.strapi* ./

ENV NODE_ENV=production
ENV PORT=1335
ENV HOST=0.0.0.0

# Donner les droits au user non-root
RUN chown -R strapi:nodejs /app

# Basculer sur l'utilisateur non-root
USER strapi

EXPOSE 1335

CMD ["npm", "run", "start"]
