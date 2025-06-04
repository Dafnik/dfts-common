export const s_stripWhitespace = (text: string | undefined | null): string => text?.trim().replace(/\s/g, '') ?? '';
