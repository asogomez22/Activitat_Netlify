# actividaddwm - Gestor de tasques

Aplicacio web desenvolupada per a l'AEA4. El projecte es desplega com a web estatica a Netlify i utilitza Supabase com a backend de tercers.

## Objectiu

Demostrar el desplegament d'una aplicacio estatica que necessita un backend extern sense construir un servidor propi.

## Funcionalitats

- Registre d'usuaris amb Supabase Auth.
- Inici i tancament de sessio.
- Llistat de tasques de l'usuari autenticat.
- Creacio de tasques amb titol i descripcio.
- Edicio de tasques existents.
- Marcar i desmarcar tasques com a completades.
- Eliminacio de tasques.

## Tecnologies

- React
- Vite
- Supabase
- Netlify

## Configuracio de Supabase

Cal crear un projecte a Supabase i configurar les variables d'entorn:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

En local, copia `.env.example` a `.env` i posa-hi els valors reals.

En Netlify, configura aquestes variables a `Site configuration > Environment variables`.

### Taula `tasks`

SQL recomanat per crear la taula:

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table tasks enable row level security;

create policy "Users can read their own tasks"
on tasks for select
using (auth.uid() = user_id);

create policy "Users can create their own tasks"
on tasks for insert
with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
on tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
on tasks for delete
using (auth.uid() = user_id);
```

## Instal.lacio i execucio local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Desplegament a Netlify

El repositori inclou `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`

Per entregar l'activitat, adjunta l'enllac del deploy de Netlify o un screencast on es vegi el funcionament.
