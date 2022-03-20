// My reference: https://discordjs.guide/interactions/slash-commands.html#registering-slash-commands
// https://discord.com/developers/applications

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');

require('dotenv').config(encoding='utf-8');

// Only run this once. Later i'll fix this
// Only run after editing or adding commands
// require('./deploy-commands.js').deployCommands();

// Create client instance
const client = new Client({ intents: Intents.FLAGS.GUILDS });

// Create list of commands to be deployed
// Adding collection property to client instance
// "Collection" extends JavaScript's native Map class
// TO DO: move these commands to events/interactionCreate.js and fix event handlers
client.commands = new Collection();
const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of command_files) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Create list of event handlers
const event_files = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of event_files) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	}
    else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

// Login to discord using bot token
client.login(process.env['BOT_TOKEN']);
