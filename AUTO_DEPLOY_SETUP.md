# GitHub → VPS automatic deployment

This project deploys automatically whenever code is pushed to the `main` branch.

Flow:

1. GitHub Actions starts `.github/workflows/deploy.yml`.
2. GitHub connects to the VPS using a dedicated SSH key.
3. VPS runs `deploy.sh` inside the project directory.
4. The script resets tracked code to the latest `origin/main`, installs production dependencies, restarts `Globalverifyed_bot`, and verifies that PM2 reports `online`.

Runtime files are safe during deployment:

- `.env` is ignored by Git.
- `data/*.json` is ignored by Git, so live catalog and stock data are not overwritten.

## Required GitHub Actions secrets

Repository → Settings → Secrets and variables → Actions:

- `VPS_HOST` — VPS IP address or hostname
- `VPS_USER` — SSH user, commonly `root`
- `VPS_PORT` — SSH port, commonly `22`
- `VPS_PATH` — full project path on the VPS, for example `/root/telegram-bot-backend`
- `VPS_SSH_KEY` — complete private deployment key, including BEGIN/END lines

Never commit `.env`, bot tokens, passwords, or private SSH keys.
