# AniVerse

Platform media anime & manga Indonesia — artikel, review, forum diskusi, dan integrasi MyAnimeList API.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Nuxt 4 (SSR + Nitro) |
| UI | Vue 3, Tailwind CSS v4 |
| Database | MySQL 8 + Drizzle ORM |
| Auth | JWT (jose) + bcryptjs |
| Rich Text | TipTap v3 |
| MAL API | OAuth 2.0 PKCE |
| Utilities | VueUse, Lenis (smooth scroll) |
| Font | Urbanist (heading) + Plus Jakarta Sans (body) |

## Fitur

- **Artikel & Review** — CRUD dengan rich text editor TipTap, kategori, dan tagging anime
- **Forum** — Thread diskusi, komentar bersarang, kategori forum
- **Anime** — Pencarian dan detail anime via MyAnimeList API
- **Auth** — Register, login, role user/moderator/admin
- **Admin Panel** — Kelola artikel, review, koneksi MAL OAuth
- **Light/Dark Mode** — Toggle persisten via VueUse + localStorage
- **Responsive** — Mobile-friendly dengan hamburger nav

## Prasyarat

- Node.js 20+
- MySQL 8+
- MyAnimeList API credentials ([myanimelist.net/apiconfig](https://myanimelist.net/apiconfig))

## Quick Start

```bash
# 1. Clone & install
git clone <repo-url>
cd my-anime-media
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi lokal

# 3. Buat database MySQL
mysql -u root -p -e "CREATE DATABASE my_anime_media CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Jalankan migrasi
npm run db:migrate

# 5. (Opsional) Seed data awal
npm run db:seed

# 6. Jalankan dev server
npm run dev
```

Buka `http://localhost:3000`.

## Environment Variables

Salin `.env.example` ke `.env` lalu isi:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=my_anime_media

JWT_SECRET=          # min 32 karakter, generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

MAL_CLIENT_ID=       # dari myanimelist.net/apiconfig
MAL_CLIENT_SECRET=   # dari myanimelist.net/apiconfig

SITE_URL=http://localhost:3000
```

## Scripts

```bash
npm run dev           # dev server (http://localhost:3000)
npm run build         # build production
npm run preview       # preview hasil build

npm run db:generate   # generate file migrasi dari schema
npm run db:migrate    # jalankan migrasi ke database
npm run db:push       # push schema langsung (dev only)
npm run db:studio     # buka Drizzle Studio (GUI)
npm run db:seed       # seed data awal
```

## Struktur Proyek

```
my-anime-media/
├── app/
│   ├── assets/css/         # Tailwind + CSS custom properties (light/dark tokens)
│   ├── components/         # AnimeSearchInput, TipTapEditor, dll
│   ├── composables/        # useAuth, useTheme
│   ├── layouts/            # default.vue (navbar + footer)
│   ├── middleware/         # auth, admin
│   └── pages/              # routing (articles, reviews, forum, anime, admin, auth)
├── server/
│   ├── api/                # Nitro route handlers (REST API)
│   ├── db/
│   │   ├── schema.ts       # Drizzle schema (MySQL)
│   │   ├── migrations/     # file migrasi SQL
│   │   └── seed.ts         # data awal
│   └── utils/              # auth helpers, MAL client
├── nuxt.config.ts
├── drizzle.config.ts
└── deployment.md           # panduan deploy VPS / Docker
```

## Deployment

Lihat [deployment.md](./deployment.md) untuk panduan lengkap deploy ke VPS (PM2 + Nginx) atau Docker.


---

## Support

If you find this project helpful, consider supporting the developer:

<div align="center">

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T61WHJPX)
&nbsp;
<a href="https://trakteer.id/bima_anzalta" target="_blank"><img src="https://edge-cdn.trakteer.id/images/embed/trbtn-red-1.png?v=14-05-2025" height="40" style="border:0px;height:40px;" alt="Trakteer Saya"></a>

</div>