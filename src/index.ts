// My reference: https://discordjs.guide/interactions/buttons.html
// https://discord.com/developers/applications

import fs from 'node:fs';
import { Client, Collection, Intents } from 'discord.js';

import dotenv from 'dotenv';
import { Command } from './types/Commands';

dotenv.config({ encoding: 'utf-8' });

// Only run this once. Later i'll fix this
// Only run after editing or adding commands
// require('./deploy-commands.js').deployCommands();

// Create client instance
const client = new Client({ intents: Intents.FLAGS.GUILDS });

// Create list of commands to be deployed
// Adding collection property to client instance
// "Collection" extends JavaScript's native Map class

// TO DO: move these commands to events/interactionCreate and fix event handlers
const command_colletion = new Collection<string, Command>();
const command_files = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.ts'));

for (const file of command_files) {
    const command : Command = require(__dirname + `/commands/${file}`);

	console.log(`[INDEX] Command <${command.data.name}> loaded.`);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
	command_colletion.set(command.data.name, command);
}

// Create list of event handlers
const event_files = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.ts'));

for (const file of event_files) {
	const event = require(__dirname + `/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, command_colletion, ...args));
	}
    else {
		client.on(event.name, (...args) => event.execute(client, command_colletion, ...args));
	}
}	

// Login to discord using bot token
client.login(process.env['BOT_TOKEN']);
