const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js')
const axios = require('axios');
const Canvas = require('canvas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-card-info')
		.setDescription('Get info (price, name, art etc.) from a specific card')
		.addStringOption((option) => option.setName('card').setRequired(true).setDescription('The card to get info for')),
    async execute(interaction) {
		const card_name = interaction.options.getString('card');
		var full_url = "https://api.scryfall.com/cards/search";

		if (card_name.length == 0)
			await interaction.reply({ content: 'Please, provide a card name!', ephemeral: true });

		console.log('[FUNC] getCardInfo: card = ' + card_name);

		await interaction.reply({content: `Chosen card: ${card_name}. Searching for it in the database...`, ephemeral: true});

		full_url += `?q=${encodeURI(card_name)}&unique=cards`;

		// TO DO: fix use of promises -> change for async/await functions

		axios.get(full_url).then((res) => {
			const data = res.data.data[0];
			// console.log(`[FUNC] getCardInfo: response from database:`);
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

			console.log(`[FUNC] Card info retrieved from database: ${JSON.stringify(card_info)}`);

			Canvas.loadImage(card_info.image).then((card_img) => {
				const canvas = Canvas.createCanvas(488, 680);
				const context = canvas.getContext('2d');

				context.drawImage(card_img, 0, 0, canvas.width, canvas.height);

				const attachment = new MessageAttachment(canvas.toBuffer(), 'card-image.png');

				interaction.followUp({ files: [attachment] });
			}).catch((err) => {
				console.log(`[FUNC] Error loading card image: ${err}`);
			});
	
			interaction.followUp(`
			Card information retrieved from database:
			====== ${card_info.name} ======
				Card mana cost: ${card_info.mana_cost}
				Card type: ${card_info.type}
				Card description: ${card_info.description}
				Card set: ${card_info.set}
				Card rarity: ${card_info.rarity}
				Card price: US$${card_info.price_usd}
			=================================================`);
		}).catch((err) => {
			console.log(`[ERROR] getCardInfo: ${err}`);
			interaction.followUp(`Error retrieving info for "${card_name}"`);
		});

		
	}
};