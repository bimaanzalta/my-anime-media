# Deployment Guide — AniVerse

## Daftar Isi

- [Local Development](#local-development)
- [VPS — PM2 + Nginx](#production--vps-pm2--nginx)
- [Docker](#production--docker)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Update Production](#update-production)

---

## Local Development

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd my-anime-media
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi lokal (lihat [Environment Variables](#environment-variables)).

### 3. Buat database MySQL

```sql
CREATE DATABASE my_anime_media CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Jalankan migrasi

```bash
npm run db:migrate
```

### 5. (Opsional) Seed data awal

```bash
npm run db:seed
```

### 6. Jalankan dev server

```bash
npm run dev
```

Akses di `http://localhost:3000`.

---

## Production — VPS (PM2 + Nginx)

### Prasyarat

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
npm install -g pm2

# MySQL 8
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Nginx
sudo apt install -y nginx
```

### 1. Setup database

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE my_anime_media CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'anime_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON my_anime_media.* TO 'anime_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Clone, konfigurasi, dan build

```bash
git clone <repo-url> /var/www/aniverse
cd /var/www/aniverse
npm install
cp .env.example .env
# Edit .env dengan nilai production
nano .env
```

Jalankan migrasi database:

```bash
npm run db:migrate
```

Build aplikasi:

```bash
npm run build
```

### 3. Buat ecosystem PM2

Buat file `/var/www/aniverse/ecosystem.config.cjs`:

```js
module.exports = {
  apps: [
    {
      name: 'aniverse',
      script: '.output/server/index.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

Jalankan dengan PM2:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # ikuti instruksi yang muncul untuk auto-start saat reboot
```

### 4. Konfigurasi Nginx

Buat file `/etc/nginx/sites-available/aniverse`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan dan reload:

```bash
sudo ln -s /etc/nginx/sites-available/aniverse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL dengan Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot akan otomatis memperbarui konfigurasi Nginx untuk HTTPS dan menyiapkan auto-renewal.

---

## Production — Docker

### Dockerfile

Buat file `Dockerfile` di root proyek:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", ".output/server/index.mjs"]
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: my_anime_media
      MYSQL_USER: anime_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  db_data:
```

### Jalankan

```bash
cp .env.example .env
# Edit .env — tambahkan DB_ROOT_PASSWORD untuk Docker
docker compose up -d
```

Setelah container `db` sehat, jalankan migrasi:

```bash
docker compose exec app node -e "
  import('./server/db/index.js').then(async ({ db }) => {
    console.log('DB connected')
  })
"
# Atau jalankan dari host dengan DB_HOST ke IP container
npm run db:migrate
```

> **Tips:** Untuk Nginx + SSL di depan Docker, gunakan konfigurasi Nginx yang sama dengan VPS di atas, proxy ke `http://127.0.0.1:3000`.

---

## Environment Variables

| Variable | Keterangan | Contoh |
|---|---|---|
| `DB_HOST` | Host MySQL | `localhost` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_USER` | Username MySQL | `anime_user` |
| `DB_PASSWORD` | Password MySQL | `strong_password` |
| `DB_NAME` | Nama database | `my_anime_media` |
| `JWT_SECRET` | Secret signing JWT, **min 32 karakter** | — |
| `MAL_CLIENT_ID` | Client ID MyAnimeList API | dari myanimelist.net/apiconfig |
| `MAL_CLIENT_SECRET` | Client Secret MyAnimeList API | dari myanimelist.net/apiconfig |
| `SITE_URL` | URL publik aplikasi (tanpa trailing slash) | `https://yourdomain.com` |

### Generate JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Cara mendapatkan MAL API credentials

1. Login ke [myanimelist.net](https://myanimelist.net)
2. Buka **Account Settings → API**
3. Klik **Create ID**
4. Isi nama aplikasi dan **App Redirect URL**: `https://yourdomain.com/api/mal/auth/callback`
5. Salin **Client ID** dan **Client Secret** ke `.env`

---

## Database

### Migrasi

Drizzle ORM mengelola skema database. File migrasi ada di `server/db/migrations/`.

```bash
# Generate migrasi baru setelah mengubah schema.ts
npm run db:generate

# Terapkan migrasi ke database
npm run db:migrate

# (Dev only) Push schema langsung tanpa file migrasi
npm run db:push

# Buka GUI Drizzle Studio
npm run db:studio
```

### Seed data awal

```bash
npm run db:seed
```

Membuat user admin default dan kategori forum/artikel awal.

---

## Update Production

### VPS (PM2)

```bash
cd /var/www/aniverse
git pull
npm install
npm run db:migrate   # jika ada perubahan skema
npm run build
pm2 restart aniverse
```

### Docker

```bash
git pull
docker compose build
docker compose up -d
```

---

## Troubleshooting

**App tidak bisa konek ke MySQL**
- Pastikan `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` di `.env` sudah benar
- Pastikan MySQL berjalan: `sudo systemctl status mysql`

**MAL OAuth callback gagal**
- Pastikan `SITE_URL` di `.env` sesuai dengan domain aktual
- Pastikan **App Redirect URL** di myanimelist.net/apiconfig diisi: `https://yourdomain.com/api/mal/auth/callback`
- Pastikan `MAL_CLIENT_SECRET` sudah diisi

**PM2 tidak auto-start setelah reboot**
- Jalankan `pm2 startup` dan ikuti perintah yang ditampilkan
- Jalankan `pm2 save` setelah memastikan proses berjalan
