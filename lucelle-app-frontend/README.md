# Lucelle — frontend

Application Next.js du projet. Ce document décrit la configuration **Supabase en self-hosted** : nouveaux schémas, variables d’environnement et droits sur les tables (API / RLS).

---

## Prérequis

- Instance Supabase self-hosted (URL + clés dans `.env`).
- Accès à la configuration **PostgREST** (souvent via Docker / `docker-compose` : variable d’environnement du service API).

---

## 1. Créer un nouveau schéma

### 1.1 Côté base (SQL)

Dans l’éditeur SQL Supabase :

```sql
create schema if not exists mon_schema;
```

Remplace `mon_schema` par le nom réel (ex. `shopping_list`). Évite les tirets dans le nom : préfère `shopping_list` à `shopping-list`.

### 1.2 Côté infra — exposer le schéma à l’API (PostgREST)

PostgREST ne sert que les schémas listés dans sa config. En self-hosted, c’est en général la variable **`PGRST_DB_SCHEMAS`** (ou équivalent selon ta stack) : liste séparée par des **virgules**, **sans espaces** sauf si ta doc l’indique.

Exemple :

```text
PGRST_DB_SCHEMAS=public,shopping_list,mon_schema
```

- Ajoute **toujours** `public` si tu t’en sers encore.
- Après modification : **redémarre le service PostgREST** (ou toute la stack API) pour recharger le cache des schémas.

### 1.3 Côté frontend — `.env`

Variables typiques déjà utilisées par l’app :

| Variable            | Rôle |
|---------------------|------|
| `SUPABASE_URL`      | URL de l’API Supabase |
| `SUPABASE_ANON_KEY` | Clé **anon** pour le navigateur / appels publics (à terme, ne pas utiliser la clé `service_role` côté client) |

Pour **centraliser le nom du schéma** métier (éviter de le dupliquer dans le code), tu peux ajouter :

```env
SUPABASE_DB_SCHEMA=shopping_list
```

Ensuite, dans les server actions / appels serveur, utilise `process.env.SUPABASE_DB_SCHEMA` avec `.schema(...)` avant `.from(...)`.

> **Sécurité :** la clé `service_role` ne doit **jamais** être exposée au navigateur. Réserve-la aux scripts serveur, migrations ou outils d’admin si nécessaire.

### 1.4 Côté code (client Supabase JS)

Pour interroger une table hors `public` :

```js
const schema = process.env.SUPABASE_DB_SCHEMA ?? "shopping_list";

const { data, error } = await supabase
  .schema(schema)
  .from("products")
  .select("name");
```

---

## 2. Droits sur une table (GRANT + RLS)

PostgREST utilise les rôles PostgreSQL **`anon`** (requête avec la clé anon, sans JWT utilisateur) et **`authenticated`** (requête avec JWT utilisateur). Les **policies RLS** filtrent les lignes **après** les `GRANT` : il faut **les deux** (privilège sur la table + policy adaptée) pour que l’API réponde correctement.

Remplace `mon_schema` et `ma_table` ci-dessous.

### 2.1 Base obligatoire pour tout schéma custom

```sql
grant usage on schema mon_schema to anon, authenticated, service_role;
```

### 2.2 Lecture publique (tout le monde avec la clé anon)

**Privilèges SQL :**

```sql
grant select on table mon_schema.ma_table to anon, authenticated;
```

**RLS** (exemple lecture ouverte pour anon et utilisateurs connectés) :

```sql
alter table mon_schema.ma_table enable row level security;

create policy "lecture publique anon et auth"
  on mon_schema.ma_table
  for select
  to anon, authenticated
  using (true);
```

### 2.3 Uniquement les utilisateurs authentifiés (plus d’accès anon)

**Révoquer la lecture anon, garder authenticated :**

```sql
revoke select on table mon_schema.ma_table from anon;
grant select on table mon_schema.ma_table to authenticated;
```

**RLS :**

```sql
drop policy if exists "lecture publique anon et auth" on mon_schema.ma_table;

create policy "lecture réservée aux connectés"
  on mon_schema.ma_table
  for select
  to authenticated
  using (true);
```

Les requêtes avec **seulement** la clé anon (sans JWT) ne verront plus les lignes (ou obtiendront une erreur selon les privilèges restants).

### 2.4 Écriture réservée aux utilisateurs authentifiés

```sql
grant select, insert, update, delete on table mon_schema.ma_table to authenticated;
-- ne pas donner insert/update/delete à anon si tu veux éviter les écritures anonymes
```

Exemple de policies (à adapter à ton modèle) :

```sql
create policy "insert authentifié"
  on mon_schema.ma_table
  for insert
  to authenticated
  with check (true);

create policy "update authentifié"
  on mon_schema.ma_table
  for update
  to authenticated
  using (true)
  with check (true);

create policy "delete authentifié"
  on mon_schema.ma_table
  for delete
  to authenticated
  using (true);
```

Affine `using` / `with check` (par ex. `auth.uid()` = propriétaire de la ligne).

### 2.5 « Admins »

Deux approches courantes :

#### A. Clé `service_role` (côté serveur uniquement)

- Le rôle **`service_role`** contourne RLS dans la configuration Supabase habituelle.
- Donne les privilèges nécessaires sur la table :

```sql
grant all on table mon_schema.ma_table to service_role;
```

- Utilise cette clé **uniquement** dans du code serveur (Server Actions, API routes, scripts), jamais dans le bundle client.

#### B. Rôle métier dans le JWT (utilisateurs « admin » sans service_role)

Exemple si ton JWT contient une claim `app_role` = `'admin'` (nom à adapter) :

```sql
create policy "lecture admin"
  on mon_schema.ma_table
  for select
  to authenticated
  using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
```

Tu dois t’assurer que cette claim est définie côté auth (Supabase Auth, hook, etc.). Les non-admins n’ont pas besoin d’une policy séparée si une policy plus large couvre déjà les autres cas — en pratique on combine souvent plusieurs policies (une pour tous les `authenticated`, une plus stricte pour certaines opérations).

### 2.6 Table `shopping_list.favorites` (favoris par utilisateur)

Si l’API ou les server actions renvoient **`permission denied for table favorites`**, c’est en général un **`GRANT` manquant** sur la table (le RLS seul ne suffit pas).

Exécute dans l’éditeur SQL (adapte le nom du schéma si besoin) :

```sql
-- Accès au schéma (si pas déjà fait)
grant usage on schema shopping_list to authenticated;

-- Droits SQL : lecture + ajout + suppression pour les utilisateurs connectés (JWT)
grant select, insert, delete on table shopping_list.favorites to authenticated;

-- Optionnel : comptes admin / scripts serveur avec service_role
grant select, insert, delete on table shopping_list.favorites to service_role;
```

Puis active le **RLS** et des policies qui limitent chaque ligne à **`auth.uid()`** :

```sql
alter table shopping_list.favorites enable row level security;

-- Supprimer d’anciennes policies du même nom si tu ré-exécutes le script
drop policy if exists "favorites_select_own" on shopping_list.favorites;
drop policy if exists "favorites_insert_own" on shopping_list.favorites;
drop policy if exists "favorites_delete_own" on shopping_list.favorites;

create policy "favorites_select_own"
  on shopping_list.favorites
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "favorites_insert_own"
  on shopping_list.favorites
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "favorites_delete_own"
  on shopping_list.favorites
  for delete
  to authenticated
  using (user_id = auth.uid());
```

**Ne donne pas** `insert` / `delete` sur `favorites` au rôle **`anon`** si seuls les comptes connectés doivent gérer les favoris.

**Vérification des privilèges :**

```sql
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'shopping_list'
  and table_name = 'favorites'
order by grantee, privilege_type;
```

Tu dois voir **`authenticated`** avec au moins **SELECT**, **INSERT**, **DELETE**.

---

## 3. Nouvelles tables dans le schéma

Pour ne pas oublier les droits sur les tables créées plus tard :

```sql
alter default privileges for role postgres in schema mon_schema
  grant select on tables to anon, authenticated;

alter default privileges for role postgres in schema mon_schema
  grant select, insert, update, delete on tables to authenticated;
```

Ajuste selon ton modèle (public vs authentifié seulement). Le rôle après `for role` doit être celui qui **crée** les tables (souvent `postgres` en self-hosted).

---

## 4. Vérifications rapides

**Privilèges sur la table :**

```sql
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'mon_schema'
  and table_name = 'ma_table'
order by grantee, privilege_type;
```

**Schéma exposé mais mauvaise erreur côté client :** vérifier `.schema('mon_schema')` dans le client JS et que `mon_schema` figure bien dans `PGRST_DB_SCHEMAS`, puis redémarrer PostgREST.

---

## 5. Commandes utiles (développement)

```bash
npm install
npm run dev
```

---

## Références internes

- Client Supabase : `supabase-client.js`
- Exemple server action + schéma custom : `actions/getSupabaseProduct.js`
- Favoris (session utilisateur + cookies) : `actions/favorites.js`
