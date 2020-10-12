# Gimmie 5 telegram bot

A tiny script that uses Gimmie 5's API to fetch your data and sends you a Telegram message (using a Bot).

## Usage

After cloning you need to create a `.env` file with the following data:

```
GIMMI_5_USERNAME=YOUR_GIMMIE_5_USERNAME
GIMMI_5_PASSWORD=YOUR_GIMMIE_5_PASSWORD   

TELEGRAM_TOKEN=YOUR_TELEGRAM_BOT_TOKEN    # Generated with a new bot
TELEGRAM_USER_ID=YOUR_TELEGARM_USER_ID    # Fetch that using the `/getUpdates` telegram endpoint
```
Then you just:

```bash
yarn 
yarn start
```

## TODO:

- Better telegram message
- Error handeling
- Docker support