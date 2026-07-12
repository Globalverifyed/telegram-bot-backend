# VPS deployment

PM2 application name: `Globalverifyed_bot`

## First installation on VPS

```bash
cd /root
git clone YOUR_REPOSITORY_URL telegram-bot-backend
cd telegram-bot-backend
cp .env.example .env
nano .env
npm ci --omit=dev
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

Run the extra command printed by `pm2 startup`, then run `pm2 save` again.

## Manual deployment test

```bash
cd /root/telegram-bot-backend
chmod +x deploy.sh
./deploy.sh
pm2 logs Globalverifyed_bot --lines 100 --nostream
```

## Automatic deployments

Once the GitHub Actions secrets are configured, every push to `main` automatically runs the same deployment process.

Live product and stock data are stored in ignored `data/*.json` files and are preserved during updates.
