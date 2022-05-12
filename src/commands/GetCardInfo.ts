
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildEmoji, Interaction, MessageActionRow, MessageAttachment, MessageButton } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import Canvas from 'canvas';
import { MessageButtonStyles } from 'discord.js/typings/enums';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-card-info')
		.setDescription('Get info (price, name, art etc.) from a specific card')
		.addStringOption((option) => option.setName('card').setRequired(true).setDescription('The card to get info for')),
    async execute(interaction: CommandInteraction) {
		const card_name = interaction.options.getString('card');
		var full_url = "https://api.scryfall.com/cards/search";

		if (card_name == null) {
			await interaction.reply({content: `Error getting card_name attribute. Please, try again!`, ephemeral: true});
			return;
		}

		if (card_name.length == 0) {
			await interaction.reply({ content: 'Please, provide a card name!', ephemeral: true });
			return;
		}

		console.log('[GET_CARD_INFO] Chosen card = ' + card_name);

		await interaction.reply({content: `Chosen card: ${card_name}. Searching for it in the database...`, ephemeral: true});

		full_url += `?q=${encodeURI(card_name)}&unique=cards`;


		let res : AxiosResponse|void = await axios.get(full_url).catch(err => {
			console.log(`[ERROR] getCardInfo: ${err}`);
			interaction.followUp(`Error retrieving info for "${card_name}"`);
			return;
		});

		if (!res) {
			return;
		}

		const data = res.data.data[0];

		// console.log(`[GET_CARD_INFO] getCardInfo: response from database:`);
		// console.log(data);
		
		const card_info = {
			"id": data.id,
			"mana_cost": data.mana_cost,
			"type": data.type_line,
			"name": data.name,
			"description": data.oracle_text,
			"set": data.set_name,
			"rarity": data.rarity,
			"power": data.power,
			"thoughness": data.toughness,
			"legality": data.legalities,
			"price_usd": data.prices.usd,
			"card_info_uri": data.uri,
			"image": data.image_uris.normal
		};

		console.log(`[GET_CARD_INFO] Card info retrieved from database: ${JSON.stringify(card_info)}`);
		
		let card_img = await Canvas.loadImage(card_info.image).catch((err) => {
			console.log(`[GET_CARD_INFO] Error loading card image: ${err}`);
			return null;
		});

		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('previousImage').setLabel('Previous Image').setStyle(MessageButtonStyles.PRIMARY),
			new MessageButton().setCustomId('nextImage').setLabel('Next Image').setStyle(MessageButtonStyles.PRIMARY)
		)

		const canvas = Canvas.createCanvas(488, 680);
		const context = canvas.getContext('2d');

		context.drawImage(card_img, 0, 0, canvas.width, canvas.height);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'card-image.png');

		await interaction.followUp({ files: [attachment], components: [row] });

		await interaction.followUp(`
		Card information retrieved from database:
		====== ${card_info.name} ======
			Card mana cost: ${card_info.mana_cost}
			Card type: ${card_info.type}
			Card description: ${card_info.description}
			Card set: ${card_info.set}
			Card rarity: ${card_info.rarity}
			Card price: US$${card_info.price_usd}
		=================================================`);
	}
};