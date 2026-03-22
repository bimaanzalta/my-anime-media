# Deployment Guide

## Stack

- **Nuxt 3** (fullstack — SSR + Nitro server)
- **MySQL 8+**
- **Node.js 20+**

---

## Local Development

### 1. Clone & install

```bash
git clone <repo-url>
cd my-anime-media
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
```

Isi nilai di `.env` sesuai konfigurasi lokal.

### 3. Buat database

```sql
CREATE DATABASE my_anime_media CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Jalankan dev server

```bash
npm run dev
```

Akses di `http://localhost:3000`.

---

## Production — VPS (PM2)

### Prerequisites

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
npm install -g pm2

# MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation
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
```

### 2. Clone & build

```bash
git clone <repo-url> /var/www/my-anime-media
cd /var/www/my-anime-media
npm install
cp .env.example .env
# Edit .env dengan nilai production
npm run build
```

### 3. Jalankan dengan PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Buat file `ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: 'my-anime-media',
      script: '.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

### 4. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

```bash
sudo ln -s /etc/nginx/sites-available/my-anime-media /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL dengan Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Production — Docker

### Dockerfile

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
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  db_data:
```

```bash
cp .env.example .env
# Edit .env
docker compose up -d
```

---

## Environment Variables

| Variable | Keterangan | Contoh |
|---|---|---|
| `DB_HOST` | Host MySQL | `localhost` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_USER` | Username MySQL | `anime_user` |
| `DB_PASSWORD` | Password MySQL | `strong_password` |
| `DB_NAME` | Nama database | `my_anime_media` |
| `JWT_SECRET` | Secret untuk signing JWT, min 32 karakter | `random-string-...` |
| `MAL_CLIENT_ID` | Client ID dari MyAnimeList API | dari myanimelist.net/apiconfig |
| `MAL_CLIENT_SECRET` | Client Secret dari MyAnimeList API | dari myanimelist.net/apiconfig |
| `SITE_URL` | URL publik aplikasi | `https://yourdomain.com` |

### Generate JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Cara mendapatkan MAL API credentials

1. Login ke [myanimelist.net](https://myanimelist.net)
2. Buka **Account Settings → API**
3. Klik **Create ID**
4. Isi nama aplikasi dan redirect URL
5. Salin **Client ID** dan **Client Secret**

---

## Update Production

```bash
cd /var/www/my-anime-media
git pull
npm install
npm run build
pm2 restart my-anime-media
```

Dengan Docker:

```bash
git pull
docker compose build
docker compose up -d
```
