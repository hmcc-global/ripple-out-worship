export const formatDate = (date: Date | string): string => {
  const dateObj = new Date(date);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

export const findFirstLetterLyrics = (text: string) => {
  let braceDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '{') {
      braceDepth++;
    } else if (char === '}') {
      braceDepth--;
    } else if (char === '[') {
      bracketDepth++;
    } else if (char === ']') {
      bracketDepth--;
    } else if (/[a-zA-Z]/.test(char) && braceDepth === 0 && bracketDepth === 0) {
      return char;
    }
  }

  return null;
};

/**
 * Pass in the chord block string, not the whole thing.
 * i.e. split it first by paragraph (verse 1, intro, chorus, bridge etc.)
 * @param text - a block of the chord lyrics like verse 1, bridge, etc.
 * @return true if the block only contains chords like intros, false otherwise.
 */
export const isChordLyricsBlockEmpty = (text: string) => {
  let braceDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '{') {
      braceDepth++;
    } else if (char === '}') {
      braceDepth--;
    } else if (char === '[') {
      bracketDepth++;
    } else if (char === ']') {
      bracketDepth--;
    } else if (/[a-zA-Z]/.test(char) && braceDepth === 0 && bracketDepth === 0) {
      // Found a letter outside of braces/brackets, so it contains lyrics
      return false;
    }
  }
  return true;
};
