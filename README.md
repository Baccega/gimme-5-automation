# Gimme 5 Automation (Telegram)

A tiny script that uses Gimme 5's API to fetch your data and sends you a Telegram message (using a Bot).

## Usage: node

After cloning you need to create a `.env` file with the following data:

```
NODE_ENV=production                       # Or 'development'

GIMME_5_USERNAME=YOUR_GIMME_5_USERNAME
GIMME_5_PASSWORD=YOUR_GIMME_5_PASSWORD   

TELEGRAM_TOKEN=YOUR_TELEGRAM_BOT_TOKEN    # Generated with a new bot
TELEGRAM_USER_ID=YOUR_TELEGRAM_USER_ID    # Fetch that using the `/getUpdates` telegram endpoint
```
Then you just:

```bash
yarn 
yarn start
```

## Usage: Docker 

You can use a docker image that will execute the code in the following way: 

```bash
docker run \
  -e NODE_ENV=production \
  -e GIMME_5_USERNAME=${YOUR_GIMME_5_USERNAME} \
  -e GIMME_5_PASSWORD=${YOUR_GIMME_5_PASSWORD} \
  -e TELEGRAM_TOKEN=${YOUR_TELEGRAM_BOT_TOKEN} \
  -e TELEGRAM_USER_ID=${YOUR_TELEGRAM_BOT_TOKEN} \
  -v ${YOUR_PERSISTENT_STORAGE_PATH}:/app/storage \
  ghcr.io/baccega/gimme-5-automation:latest
```
