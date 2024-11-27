# discord-bot

The Discord Status Bot generates an image that visually represents the real-time status (online, offline, idle, do not disturb) of users in a Discord server. This bot provides a clear, graphical overview of the server's member activity.

## Features
* 📊 Real-Time Status Visualization: Displays the current status of server members in a clean image format.
* 🖼️ Automated Image Generation: Automatically generates and updates the status image.
* 🔄 Real-Time Updates: The image is regularly updated to reflect the latest user statuses.
* 🛡️ Role-Based Access: Limits access to certain commands or features based on roles or permissions.


## Requirements
1. Discord API Token: Obtainable from the Discord Developer Portal.
2. Node.js: Version 14+ recommended.
3. Required Packages:
 * ```discord.js```: To interact with the Discord API.
 * ```canvas```: To generate images.

## Installation

### 1. Create a Bot Token
1. Visit the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a new application and add a bot.
3. Copy the bot token for later use.

### 2. Set Up the Bot

1. Clone the repository:
```bash
git clone https://github.com/your-username/discord-status-bot.git
cd discord-status-bot
```

2. Install dependencies:
```bash
npm install
```
Fill in the data in ``/botconfig/config.json`` or copy the ``example.config.json``:
```json
{
  "token": "TOKEN",
  "prefix": "-",
  "loadSlashGlobal": true, "_COMMENT_": "Set it to true, when your Slash Commands are ready, false loads instant true loads slow but stable! (GLOBAL/GUILD COMMANDS, DISCORD DOCS!)",
  "webserver": {
    "enabled": true,
    "port": 3000,
    "server_port": 443,
    "domain": "localhost"
  },
  "database": {
    "host": "localhost",
    "user": "root",
    "password": "",
    "table": "discord_status_bot"
  },
  "presence_log_channel": "CHANNEL_ID",
  "slashCommandsDirs": [
        {
            "Folder": "Info",
            "CmdName": "info",
            "CmdDescription": "Grant specific Information about something!"
        },
        {
            "Folder": "Admin",
            "CmdName": "admin",
            "CmdDescription": "Administrate the Server!"
        }
   ]
}
```

## Running the Bot

1. Running in a Dev Enviroment

You can start the Bot via:

```bash
npm run dev
```

2. Running in a Production

You can start the Bot via ``pm2 start ecosystem.config.js``.

The Ecosystem Config starts one Instance. 




