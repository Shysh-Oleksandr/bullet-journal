import config from '../config/config';

const charCodeShiftNumber  = +config.security.charCodeShiftNumber;

export const obfuscateText = (text: string) => {
    return text
        .split('')
        .map((char) => {
            const charCode = char.charCodeAt(0);
            return String.fromCharCode(charCode + charCodeShiftNumber);
        })
        .join('');
};

export const deobfuscateText = (obfuscatedText: string) => {
    return obfuscatedText
        .split('')
        .map((char) => {
            const charCode = char.charCodeAt(0);
            return String.fromCharCode(charCode - charCodeShiftNumber);
        })
        .join('');
};
