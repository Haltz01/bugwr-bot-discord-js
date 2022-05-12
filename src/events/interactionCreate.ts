import { Client, Collection, Interaction } from "discord.js";
import Module from "module";
import { Command } from "../types/Commands";

module.exports = {
	name: 'interactionCreate',
	once: true,
	async execute(client : Client, command_colletion : Collection<string, Command>, interaction : Interaction) {
		if (!interaction.isCommand()) return;

        if (interaction.guild == null) {
            return;
        }
        
        console.log(`[INTERACTION_CREATE] Command <${interaction.commandName}> triggered by ${interaction.user.username} in #${interaction.guild.name}`);

        const command = command_colletion.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
	}
};