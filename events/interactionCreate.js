module.exports = {
	name: 'interactionCreate',
	once: true,
	async execute(client, interaction) {
		if (!interaction.isCommand()) return;
        
        console.log(`[CMD] Command <${interaction.commandName}> triggered by ${interaction.user.username} in #${interaction.guild.name}`);

        const command = client.commands.get(interaction.commandName);

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