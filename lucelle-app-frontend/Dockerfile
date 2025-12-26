# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Arguments de build pour les variables d'environnement
# ARG REVALIDATE_TIME

# Convertir les ARG en ENV pour qu'elles soient disponibles au build Next.js
# ENV REVALIDATE_TIME=$REVALIDATE_TIME

# Copier uniquement les fichiers de dépendances d'abord (cache Docker)
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Build Next.js
RUN npm run build

# Runtime stage
FROM node:20-alpine

# Créer un utilisateur et un groupe non-root
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Donner les droits au user non-root
RUN chown -R nextjs:nodejs /app

# Basculer sur l'utilisateur non-root
USER nextjs

EXPOSE 3001

CMD ["npm", "run", "start"]