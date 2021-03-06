"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_1 = require("@discordjs/rest");
var v9_1 = require("discord-api-types/v9");
var node_fs_1 = __importDefault(require("node:fs"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ encoding: 'utf-8' });
var commands = [];
var command_files = node_fs_1.default.readdirSync('./commands').filter(function (file) { return file.endsWith('.js'); });
for (var _i = 0, command_files_1 = command_files; _i < command_files_1.length; _i++) {
    var file = command_files_1[_i];
    var command = require("./commands/".concat(file));
    commands.push(command.data.toJSON());
}
function deployCommands() {
    return __awaiter(this, void 0, void 0, function () {
        var BOT_TOKEN, CLIENT_ID, GUILD_ID, rest, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    BOT_TOKEN = process.env['BOT_TOKEN'];
                    CLIENT_ID = process.env['CLIENT_ID'];
                    GUILD_ID = process.env['GUILD_ID'];
                    if (BOT_TOKEN === undefined) {
                        throw new Error('No BOT_TOKEN found in .env file.');
                    }
                    rest = new rest_1.REST({ version: '9' }).setToken(BOT_TOKEN);
                    if (CLIENT_ID === undefined) {
                        throw new Error('No CLIENT_ID found in .env file.');
                    }
                    if (GUILD_ID === undefined) {
                        throw new Error('No GUILD_ID found in .env file.');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('Started refreshing application (/) commands.');
                    return [4 /*yield*/, rest.put(v9_1.Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })];
                case 2:
                    _a.sent();
                    // TO DO: deploy commands globally - to all servers that give the bot the 'applications.commands' scope
                    console.log('Successfully reloaded application (/) commands.');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
deployCommands();
// module.exports = { deployCommands };
