import { Client, Collection, Interaction } from "discord.js";
import { Command } from "../types/Commands";

module.exports = {
	name: 'ready',
	once: true,
	execute(client : Client, command_colletion : Collection<string, Command>, interaction : Client<true>) {
		console.log(`[READY] Logged in as ${interaction.user.tag}`);
	},
};