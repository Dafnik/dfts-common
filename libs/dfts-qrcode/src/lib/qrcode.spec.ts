import { generateQrCodeImage, generateQrCodeMatrix, generateQrCodeSVGString } from './qrcode';
import fs from 'fs/promises';
import fss from 'fs';
import { a_shuffle, s_stripWhitespace } from 'dfts-helper';
import Jimp from 'jimp';
import jsQR from 'jsqr';

describe('QRCode', () => {
  it('generate correct Numeric qrcode svg', () => {
    const test = generateQrCodeSVGString('123456798', { mode: 'numeric' });
    console.log(test);
    expect(s_stripWhitespace(test)).toEqual(
      s_stripWhitespace(`<svg xmlns="http://www.w3.org/2000/svg"
    width="145" height="145"   >
    <rect width="145" height="145" fill="#ffffff" />
    <rect x="20" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="25" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="95" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="20" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="25" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="30" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="35" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="40" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="45" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="45" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="45" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="45" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="45" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="45" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="25" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="95" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="50" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="55" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="55" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="55" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="55" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="25" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="85" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="95" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="60" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="65" width="5.3" height="5.3" fill="#000000" />
    <rect x="25" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="70" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="75" width="5.3" height="5.3" fill="#000000" />
    <rect x="55" y="75" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="75" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="75" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="75" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="75" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="75" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="80" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="85" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="85" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="85" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="85" width="5.3" height="5.3" fill="#000000" />
    <rect x="85" y="85" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="85" width="5.3" height="5.3" fill="#000000" />
    <rect x="95" y="85" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="25" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="85" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="95" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="90" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="85" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="95" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="95" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="70" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="75" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="85" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="95" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="100" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="105" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="110" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="115" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="115" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="115" width="5.3" height="5.3" fill="#000000" />
    <rect x="65" y="115" width="5.3" height="5.3" fill="#000000" />
    <rect x="80" y="115" width="5.3" height="5.3" fill="#000000" />
    <rect x="100" y="115" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="115" width="5.3" height="5.3" fill="#000000" />
    <rect x="20" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="25" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="30" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="35" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="40" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="45" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="50" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="60" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="90" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="105" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="110" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="115" y="120" width="5.3" height="5.3" fill="#000000" />
    <rect x="120" y="120" width="5.3" height="5.3" fill="#000000" />
    </svg>`),
    );
  });
  it('generate correct Numeric qrcode matrix', () => {
    expect(generateQrCodeMatrix('123456798', { mode: 'numeric' })).toStrictEqual([
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
      [0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1],
    ]);
  });
  it('generate correct alpha numeric qrcode matrix', () => {
    expect(generateQrCodeMatrix('AT123456798', { mode: 'alphanumeric' })).toStrictEqual([
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    ]);
  });
  it('generate correct byte qrcode matrix', () => {
    expect(generateQrCodeMatrix('AT123456798!!ww:', { mode: 'octet' })).toStrictEqual([
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    ]);
  });
  it('generate correct auto detected Numeric qrcode matrix', () => {
    expect(generateQrCodeMatrix('123456798')).toStrictEqual([
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
      [0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1],
    ]);
  });
  it('generate correct auto detected alpha numeric qrcode matrix', () => {
    expect(generateQrCodeMatrix('AT123456798')).toStrictEqual([
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    ]);
  });
  it('generate correct auto dected byte qrcode matrix', () => {
    expect(generateQrCodeMatrix('AT123456798!!ww:')).toStrictEqual([
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    ]);
  });
});

describe('Automated random test', () => {
  const ids = a_shuffle(readTestStrings()).slice(0, 1000);

  console.info(`Ids to test: ${ids.length}`);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    it(`test ${i} with "${id}"`, async () => {
      expect(id).toBe(await testQrCodeGeneratorWithFile(id));
    });
  }
});

// Function to read the JSON file and parse it back to an array
function readTestStrings(): string[] {
  return JSON.parse(fss.readFileSync('spec/randomStrings.json', 'utf8')) as string[];
}

async function testQrCodeGeneratorWithFile(input: string): Promise<string> {
  await fs.writeFile('spec/image.png', generateQrCodeImage(input).dataUrl.replace(/^data:image\/png;base64,/, ''), { encoding: 'base64' });

  return await decodeQR();
}

async function decodeQR(): Promise<string> {
  // Load the image with Jimp
  const image = await Jimp.read('spec/image.png');

  // Get the image data
  const imageData = {
    data: new Uint8ClampedArray(image.bitmap.data),
    width: image.bitmap.width,
    height: image.bitmap.height,
  };

  // Use jsQR to decode the QR code
  const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

  if (!decodedQR) {
    throw new Error('QR code not found in the image.');
  }
  return decodedQR.data;
}
