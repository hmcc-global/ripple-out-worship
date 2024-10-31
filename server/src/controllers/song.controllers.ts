import { Request, RequestHandler, Response } from 'express';
import { Song } from '../models/song.model';
import { SongDocument } from '../types/song.types';

const sendResponse = (
  res: Response,
  statusCode: number,
  payload: SongDocument[] | SongDocument | string
) => {
  return res.status(statusCode).json(payload);
};

const createSong: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { ...toCreate } = req.body;

  if (Object.keys(toCreate).length > 0) {
    try {
      const data: SongDocument = await Song.create(toCreate);

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Song not created');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const getSong: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: songId } = req.query;

  if (songId) {
    try {
      const data: SongDocument | null = await Song.findOne({
        _id: songId,
        isDeleted: false,
      }).exec();

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Song not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    try {
      const data: SongDocument[] = await Song.find({ isDeleted: false }).exec();

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Songs not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  }
};
const searchSongs: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { keyword, tempo, themes, page = 1, limit = 20 } = req.query;

  const tempoArray = Array.isArray(tempo) ? tempo : [tempo].filter(Boolean);
  const themesArray = Array.isArray(themes) ? themes : [themes].filter(Boolean);

  const parsedPage = Math.max(1, Number(page)); // Ensure page is at least 1
  const parsedLimit = Math.max(1, Math.min(100, Number(limit))); // Limit max limit for safety

  try {
    const query: any = {
      isDeleted: false,
    };

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (tempoArray.length > 0) {
      query.tempo = { $in: tempoArray };
    }
    if (themesArray.length > 0) {
      query.themes = { $in: themesArray };
    }
    const skip = (parsedPage - 1) * parsedLimit;
    const data: SongDocument[] = await Song.find(query).skip(skip).limit(parsedLimit).exec();
    const totalCount = await Song.countDocuments(query).exec();
    res.status(200).json({
      data,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error: any) {
    sendResponse(res, 500, error?.message);
  }
};

const getSongView: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { ...filter } = req.body;
  if (Object.keys(filter).length > 0) {
    //for future features, can share link with pre filtered songs, also needs to define req lol
  } else {
    try {
      const data: SongDocument[] = await Song.find({ isDeleted: false })
        .select(
          '_id title tempo originalKey themes artist year code isVerified isDeleted createdAt updatedAt simplifiedChordLyrics timeSignature'
        )
        .exec();

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Songs not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  }
};

const updateSong: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: songId, ...toUpdate } = req.body;

  if (songId && Object.keys(toUpdate).length > 0) {
    try {
      const updatedSong = await Song.updateOne(
        { _id: songId, isDeleted: false },
        { $set: toUpdate }
      );

      if (updatedSong) {
        sendResponse(res, 200, 'Song updated');
      } else {
        sendResponse(res, 404, 'Song not updated');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const deleteSong: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: songId } = req.query;

  if (songId) {
    try {
      await Song.updateOne({ _id: songId, isDeleted: false }, { $set: { isDeleted: true } });
      sendResponse(res, 200, 'Song successfully deleted');
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

export { createSong, getSong, getSongView, updateSong, deleteSong, searchSongs };
