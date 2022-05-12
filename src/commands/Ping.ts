import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction : CommandInteraction) {
		await interaction.reply({content: 'Pong!', ephemeral: true}); // interaction token is only valid for three seconds, so that's the timeframe in which we are able to use the reply()
	}
};