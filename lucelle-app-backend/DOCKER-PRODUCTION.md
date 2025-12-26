# Configuration Docker Production

Ce guide explique comment configurer le backend Strapi pour se connecter au conteneur MySQL existant (`mysql-main`) sur votre VPS.

## Prérequis

-  Conteneur MySQL existant nommé `mysql-main`
-  MySQL accessible sur le port 3306 (interne au conteneur)

## Configuration du réseau Docker

### Vérification du réseau

Le conteneur `mysql-main` utilise déjà le réseau `web-network`, qui est également utilisé par le service Strapi. La configuration est donc **déjà correcte** et prête à l'emploi.

Pour vérifier (déjà fait) :

```bash
docker inspect mysql-main | grep -A 10 Networks
```

**Résultat attendu** : Le conteneur `mysql-main` doit être sur le réseau `web-network`.

### Configuration

Le fichier `docker-compose.yml` est configuré pour :

-  Utiliser le réseau `web-network` (externe)
-  Se connecter à MySQL via le hostname `mysql-main` (nom du conteneur)
-  Utiliser le port interne `3306` du conteneur MySQL

**Aucune modification nécessaire** - la configuration est prête pour la production.

## Configuration des variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
DATABASE_CLIENT=mysql
DATABASE_NAME=votre_base_de_donnees
DATABASE_USERNAME=votre_utilisateur
DATABASE_PASSWORD=votre_mot_de_passe
```

**Note importante** :

-  `DATABASE_HOST` est automatiquement défini à `mysql-main` (nom du conteneur)
-  `DATABASE_PORT` est automatiquement défini à `3306` (port interne du conteneur)

## Déploiement

1. **Copier les fichiers** sur le VPS :

   ```bash
   scp -r backend/ user@vps:/path/to/lucelle-app/
   ```

2. **Vérifier que le réseau web-network existe** (déjà créé car mysql-main l'utilise) :

   ```bash
   docker network ls | grep web-network
   ```

   Si le réseau n'existe pas (peu probable), créez-le :

   ```bash
   docker network create web-network
   ```

3. **Démarrer le service** :

   ```bash
   cd /path/to/lucelle-app/backend
   docker compose up -d --build
   ```

4. **Vérifier les logs** :
   ```bash
   docker compose logs -f app
   ```

## Vérification

Le conteneur Strapi devrait être accessible sur `http://vps-ip:1335`

Pour vérifier la connexion à MySQL :

```bash
docker compose exec app npm run strapi console
```

## Dépannage

### Erreur de connexion à MySQL

1. Vérifiez que les deux conteneurs sont sur le même réseau :

   ```bash
   docker network inspect web-network
   ```

   Vous devriez voir `lucelle-app-backend` et `mysql-main` dans la liste des conteneurs.

2. Testez la connexion depuis le conteneur Strapi :

   ```bash
   docker compose exec app ping mysql-main
   ```

3. Vérifiez les variables d'environnement :
   ```bash
   docker compose exec app env | grep DATABASE
   ```
