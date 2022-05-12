import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { exit } from 'node:process';

dotenv.config({ encoding: 'utf-8' });

const commands : string[] = [];
const command_files = fs.readdirSync(__dirname +  '/../commands').filter(file => file.endsWith('.js'));

for (const file of command_files) {
	const command = require(__dirname + `/commands/${file}`);
	commands.push(command.data.toJSON());
}

async function deployCommands() {
    const BOT_TOKEN : string|undefined = process.env['BOT_TOKEN'];
    const CLIENT_ID : string|undefined = process.env['CLIENT_ID'];
    const GUILD_ID : string|undefined = process.env['GUILD_ID'];
    
    
    if (BOT_TOKEN === undefined) {
        throw new Error('No BOT_TOKEN found in .env file.');
    }
    
    const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);
    
    if (CLIENT_ID === undefined) {
        throw new Error('No CLIENT_ID found in .env file.');
    }
    
    if (GUILD_ID === undefined) {
        throw new Error('No GUILD_ID found in .env file.');
    }

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
        // TO DO: deploy commands globally - to all servers that give the bot the 'applications.commands' scope

        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
}

deployCommands();
// module.exports = { deployCommands };