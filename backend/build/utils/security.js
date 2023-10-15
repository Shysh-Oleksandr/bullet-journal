"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deobfuscateText = exports.obfuscateText = void 0;
const config_1 = __importDefault(require("../config/config"));
const charCodeShiftNumber = +config_1.default.security.charCodeShiftNumber;
const obfuscateText = (text) => {
    return text
        .split('')
        .map((char) => {
        const charCode = char.charCodeAt(0);
        return String.fromCharCode(charCode + charCodeShiftNumber);
    })
        .join('');
};
exports.obfuscateText = obfuscateText;
const deobfuscateText = (obfuscatedText) => {
    return obfuscatedText
        .split('')
        .map((char) => {
        const charCode = char.charCodeAt(0);
        return String.fromCharCode(charCode - charCodeShiftNumber);
    })
        .join('');
};
exports.deobfuscateText = deobfuscateText;
