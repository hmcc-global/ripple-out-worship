import { Fragment } from 'react';

const getLyricsPreview = (lyrics: string) => {
  //get the first verse only
  const firstVerse = lyrics.split('}')[1];
  const cleanLyrics = firstVerse
    ?.split('{')[0]
    ?.replace(/\[.*?\]/g, '')
    .trim();
  if (cleanLyrics) {
    return cleanLyrics.split('\n').map((line, i) => (
      <Fragment key={i}>
        {line}
        <br />
      </Fragment>
    ));
  }

  // If cleanLyrics is undefined, return an empty string
  return '';
};
export default getLyricsPreview;
