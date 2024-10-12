import { Request, Response } from "express";

import Results from "../models/results.model";

const resultController = {
  getResultsAllInfor: async (req: Request, res: Response) => {
    try {
      const nodes = await Results.find({userId: (<any>req).user.id});
      res.json(nodes);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  favoriteResult: async (req: Request, res: Response) => {
    try {
      let result = await Results.findById((<any>req).resultID);
      if(result?.isFavorite) {
        // result?.isFavorite = true;
      }
      result?.save();
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  saveResults: async (req: Request, res: Response) => {
    const { name, industry, country, address, phone, email, website, googleReviewRating } = req.body;
    try {
      // if ( !title || !nodeAddress)
      //   return res.status(400).json({ msg: "Please fill in all fields." });

      const node = await Results.findOne({ website });

      if (node)
        return res.status(400).json({ msg: "This Ip Address already exists." });

      const newNode = {
        name, 
        industry, 
        country, 
        address, 
        phone, 
        email, 
        website, 
        googleReviewRating, 
      };

      const _newNode = new Results(newNode);
      await _newNode.save();
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  }

};
export default resultController;
