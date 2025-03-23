import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityService {
  private charCodeShiftNumber: number;

  constructor(private configService: ConfigService) {
    const configShiftValue = this.configService.get<string>(
      'security.charCodeShiftNumber',
    );
    const parsedValue = configShiftValue ? parseInt(configShiftValue, 10) : NaN;
    this.charCodeShiftNumber = parsedValue!;
  }

  obfuscateText(text: string): string {
    return text
      .split('')
      .map((char) => {
        const charCode = char.charCodeAt(0);
        return String.fromCharCode(charCode + this.charCodeShiftNumber);
      })
      .join('');
  }

  deobfuscateText(obfuscatedText: string): string {
    return obfuscatedText
      .split('')
      .map((char) => {
        const charCode = char.charCodeAt(0);
        return String.fromCharCode(charCode - this.charCodeShiftNumber);
      })
      .join('');
  }
}
