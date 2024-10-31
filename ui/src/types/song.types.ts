import { UserEditorFields } from './user.types';

type SongEditorFields = {
  artist: string;
  title: string;
  themes: Array<string>;
  tempo: Array<string>;
  year: string;
  code: string;
  timeSignature: string[];
  originalKey: string;
  recommendedKeys: Array<string>;
  chordLyrics: string;
  simplifiedChordLyrics: string;
};

interface SongEditorProps {
  actionOnEditor: string;
}

export type { SongEditorFields, SongEditorProps };

export type FieldArrayProps = {
  data: string[] | string;
};

export type SongCardProps = {
  _id: string;
  title: string;
  timeSignature: string[];
  tempo: string[];
  originalKey: string;
  themes: string[];
  artist: string;
  year: string;
  code: string;
  firstLine: string;
  chordLyrics: string;
  createdBy: UserEditorFields;
  lastUpdatedBy: UserEditorFields;
  filterData?: SongSearchFilter;
  isVerified: Boolean;
  createdAt: Date;
  updatedAt: Date;
  showDetails?: boolean;
  isDesktop: boolean;
};

export type SongSearchProps = {
  songs: SongSchema[];
  filterData: SongSearchFilter | undefined;
  setFilterData: React.Dispatch<React.SetStateAction<SongSearchFilter | undefined>>;
  onClose: () => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isDesktop: boolean;
};

export type SongSearchFilter = {
  search?: string | null | undefined;
  timeSignature?: string[];
  tempo?: string[];
  themes?: string[];
  display?: {
    tempo: boolean;
    themes: boolean;
    originalKey: boolean;
    year: boolean;
    code: boolean;
    timeSignature: boolean;
    firstLine: boolean;
  };
};

export type SongViewSchema = {
  _id: string;
  title: string;
  timeSignature: string[];
  tempo: string[];
  originalKey: string;
  themes: string[];
  artist: string;
  year: string;
  code: string;
  createdBy: UserEditorFields;
  lastUpdatedBy: UserEditorFields;
  isVerified: boolean;
  chordLyrics: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SongSchema = {
  _id: string;
  title: string;
  timeSignature: string[];
  tempo: string[];
  originalKey: string;
  themes: string[];
  artist: string;
  year: string;
  code: string;
  createdBy: UserEditorFields;
  lastUpdatedBy: UserEditorFields;
  isVerified: boolean;
  chordLyrics: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  simplifiedChordLyrics: string;
  recommendedKeys: Array<string>;
};

export type SongSetlistSchema = SongSchema & {
  key: string;
  sequence: number;
};
