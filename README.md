# cerberusbot
A Discord Bot

Work in progress --- Installation (Ubuntu):

Download Ubuntu Server
https://ubuntu.com/download/server

Install Ubuntu Server
Physical or Virtual Machine

Get latest updates for Ubuntu Server
sudo apt update && sudo apt upgrade -y

Install Node.js
sudo apt install nodejs

Check node is installed
node -v

Install Node.js package manager
sudo apt install npm

Install discord.js
sudo npm install --legacy-peer-deps --save discord.js

Clone from GitHub
git clone https://github.com/Cerberus_Zer0/cerberusbot
Password = Personal access tokens (GitHub > Settings > Developer)

Create .env file
TOKEN = "" [this is your discord bot token]
GOOGLE_API_KEY = "" [youtube api key]
SPOTIFY_CLIENT_ID = ""
SPOTIFY_CLIENT_SECRET = ""

Start it up?
node index.js
