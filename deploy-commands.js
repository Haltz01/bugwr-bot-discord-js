const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');

require('dotenv').config(encoding='utf-8');

const commands = [];
const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of command_files) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env['BOT_TOKEN']);

async function deployCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(process.env['CLIENT_ID'], process.env['GUILD_ID']), { body: commands });
        // TO DO: deploy commands globally - to all servers that give the bot the 'applications.commands' scope

        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
}

deployCommands();
// module.exports = { deployCommands };