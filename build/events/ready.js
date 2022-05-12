"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'ready',
    once: true,
    execute: function (client, interaction) {
        console.log("[READY] Logged in as ".concat(interaction.user.tag));
    },
};
