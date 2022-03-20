module.exports = {
	name: 'ready',
	once: true,
	execute(client, interaction) {
		console.log(`[INFO] Ready! Logged in as ${interaction.user.tag}`);
	},
};