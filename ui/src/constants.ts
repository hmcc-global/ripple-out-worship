// song constants
export const musicKeysOptions = [
  'A',
  'A#',
  'Bb',
  'B',
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
];

export const CardFields = ['Themes', 'Tempo', 'Original Key', 'Year', 'Code', 'Time', 'First Line'];

export const flatMusicKeysOptions = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
  'C',
];
export const sharpMusicKeysOptions = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
  'C',
];

export const tempoOptions = ['Fast', 'Medium', 'Slow', 'Medium Slow'];
export const timeSignatureOptions = ['4/4', '3/4', '6/8', '2/4', '2/2', '9/8', '12/8', 'Others'];

export const themeOptions = [
  'Attributes of God',
  'Declaration (Victorious/Kingdom)',
  'The Cross',
  'Call to Worship',
  'Celebration',
  'Church / Unity',
  'Dependence',
  'Freedom / Overcoming Sin',
  `God's Faithfulness`,
  `God's Presence`,
  'Holiness / Purity',
  'Holy Spirit',
  'Hope',
  'Intimacy / Love for God',
  'Missions / Evangelism',
  'Obedience / Trust',
  'Prayer',
  'Purpose/Destiny',
  'Repentance',
  'Resurrection',
  'Surrender / Sacrifice',
  'Thankfulness/Gratitude',
  'The Cross',
  `Worship / Adoration / Praise`,
];
export const themeSelectionLimit = 3;

export const displayResultOptions = [
  'Themes',
  'Tempo',
  'Original Key',
  'Year',
  'Code',
  'Time',
  'First Line Lyric',
];

// register/login form
export const formSpacing = { xs: 2, sm: 2, md: 3, lg: 3, xl: 3 };

export const formWidth = { xs: '85vw', sm: '60w', md: '60vw', lg: '40vw', xl: '30vw' };

//chord colors:
export const ChordColors: Record<string, string> = {
  C: '#874F00',
  'C#': '#874F00',
  Db: '#255C0D',
  D: '#255C0D',
  'D#': '#255C0D',
  Eb: '#045C7A',
  E: '#045C7A',
  F: '#1D309D',
  'F#': '#1D309D',
  Gb: '#471383',
  G: '#471383',
  'G#': '#471383',
  Ab: '#840000',
  A: '#840000',
  'A#': '#840000',
  Bb: '#992E00',
  B: '#992E00',
  Cm: '#874F00',
  'C#m': '#874F00',
  Dbm: '#255C0D',
  Dm: '#255C0D',
  'D#m': '#255C0D',
  Ebm: '#045C7A',
  Em: '#045C7A',
  Fm: '#1D309D',
  'F#m': '#1D309D',
  Gbm: '#471383',
  Gm: '#471383',
  'G#m': '#471383',
  Abm: '#840000',
  Am: '#840000',
  'A#m': '#840000',
  Bbm: '#992E00',
  Bm: '#992E00',
};

export const DESKTOP_SIDEBAR_WIDTH = '100px';
export const MOBILE_NAVBAR_HEIGHT = '80px';

export const specificSongsMobileWidth = '600px';
export const specificSongsTabletWidth = '900px';
export const specificSongsDesktopWidth = '1340px';

export const MAXIMUM_DESKTOP_HEIGHT = '960px';

export const MOBILE_PAGE_HEADER_HEIGHT = '60px';
export const TABLET_PAGE_HEADER_HEIGHT = '70px';
export const DESKTOP_PAGE_HEADER_HEIGHT = '80px';

export const MOBILE_ACTION_BUTTONS_HEIGHT = '60px';
