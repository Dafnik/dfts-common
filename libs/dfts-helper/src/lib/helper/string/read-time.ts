import {s_stripWhitespace} from './strip-whitespace';
import {n_humanizeTime} from '../number/humanize-time';
import {s_countWords} from './count-words';

const WORDS_PER_MIN = 275; // wpm
const IMAGE_READ_TIME = 12; // in seconds

/**
 * Calculates the estimated time it takes to read a piece of text.
 * @param {string} text - The text to be read.
 * @param {number} [imageCounter=0] - The number of images in the text.
 * @returns {string} - The estimated time it takes to read the text, in the format "Xm" where X is the number of minutes.
 */
export const s_readTime = (text: string, imageCounter = 0): string =>
  n_humanizeTime(imageReadTime(imageCounter) + calculateWordsReadTime(s_stripWhitespace(text)));

/**
 * Calculates the estimated time it takes to read text based on the number of words and a given words per minute rate.
 * @param {string} text - The text to be read.
 * @param {number} [wordsPerMin=WORDS_PER_MIN] - The words per minute rate to use for calculating read time.
 * @returns {number} - The estimated time it takes to read the text in minutes.
 */
export const calculateWordsReadTime = (text: string, wordsPerMin = WORDS_PER_MIN): number =>
  s_countWords(removeOtherLanguageCharacters(text)) / wordsPerMin;

/**
 * Removes any Chinese, Japanese, or Korean characters from a string.
 * @param {string} text - The text to be processed.
 * @returns {string} - The text with all CJK characters removed.
 */
export const removeOtherLanguageCharacters = (text: string): string =>
  text.replace(new RegExp('[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]', 'g'), '');

/**
 * Calculates the estimated time it takes to read images based on the number of images and a given time per image.
 * @param {number} count - The number of images to be read.
 * @param {number} [customImageTime=IMAGE_READ_TIME] - The time per image to use for calculating read time.
 * @returns {number} - The estimated time it takes to read the images in minutes.
 */
export const imageReadTime = (count: number, customImageTime = IMAGE_READ_TIME): number =>
  count > 10 ? ((count / 2) * (customImageTime + 3) + (count - 10) * 3) / 60 : ((count / 2) * (2 * customImageTime + (1 - count))) / 60;
