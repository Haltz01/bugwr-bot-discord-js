"use strict";
// My reference: https://discordjs.guide/interactions/buttons.html
// https://discord.com/developers/applications
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = __importDefault(require("node:fs"));
var discord_js_1 = require("discord.js");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ encoding: 'utf-8' });
// Only run this once. Later i'll fix this
// Only run after editing or adding commands
// require('./deploy-commands.js').deployCommands();
// Create client instance
var client = new discord_js_1.Client({ intents: discord_js_1.Intents.FLAGS.GUILDS });
// Create list of commands to be deployed
// Adding collection property to client instance
// "Collection" extends JavaScript's native Map class
// TO DO: move these commands to events/interactionCreate.js and fix event handlers
var command_colletion = new discord_js_1.Collection();
var command_files = node_fs_1.default.readdirSync('./commands').filter(function (file) { return file.endsWith('.ts'); });
for (var _i = 0, command_files_1 = command_files; _i < command_files_1.length; _i++) {
    var file = command_files_1[_i];
    var command = require("./commands/".concat(file));
    console.log("[INDEX] Command <".concat(command.data.name, "> loaded."));
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    command_colletion.set(command.data.name, command);
}
// Create list of event handlers
var event_files = node_fs_1.default.readdirSync('./events').filter(function (file) { return file.endsWith('.ts'); });
var _loop_1 = function (file) {
    var event_1 = require("./events/".concat(file));
    if (event_1.once) {
        client.once(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, __spreadArray([client, command_colletion], args, false));
        });
    }
    else {
        client.on(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, __spreadArray([client, command_colletion], args, false));
        });
    }
};
for (var _a = 0, event_files_1 = event_files; _a < event_files_1.length; _a++) {
    var file = event_files_1[_a];
    _loop_1(file);
}
// Login to discord using bot token
client.login(process.env['BOT_TOKEN']);
