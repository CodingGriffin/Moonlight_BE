import { Request, Response } from "express";
import { google } from "googleapis";
import path from "path";

import Sheets from "../models/sheets.model";

const resultController = {
  getResultsAllInfor: async (req: Request, res: Response) => {
    try {
      const sheets = await Sheets.find({userId: (<any>req).user._id});
      return res.json(sheets);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const sheet = await Sheets.findById((<any>req).params.id);
      return res.json(sheet?.results);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addSheet: async (req: Request, res: Response) => {
    // console.log(req.body);
    const { data } = req.body;
    // console.log(data);
    try {
			const newSheet = new Sheets({
				userId: (<any>req).user._id,
        name: data.name,
        results: data.results
			  });
		
			await newSheet.save();

    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  combine: async (req: Request, res: Response) => {
    // console.log(req.body);
    const { targetId, droppedId } = req.body;
    // console.log(data);
    try {
      const targetSheet = await Sheets.findById(targetId);
      const droppedSheet = await Sheets.findById(droppedId);
      targetSheet?.results = targetSheet?.results.concat(droppedSheet?.results);
      await targetSheet?.save();
      await droppedSheet?.delete();
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      let sheet = await Sheets.findById((<any>req).params.id);
      await sheet?.delete();
      const sheets = await Sheets.find({userId: (<any>req).user._id, isFavorite: true});
      return res.json(sheets);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

};
export default resultController;
