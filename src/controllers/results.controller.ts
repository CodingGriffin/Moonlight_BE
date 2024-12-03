import { Request, Response } from "express";
import { google } from "googleapis";
import path from "path";
import Results from "../models/results.model";
import { id } from "date-fns/locale";
const { ObjectId } = require('mongodb');

const resultController = {
  getResultsAllInfor: async (req: Request, res: Response) => {
    try {
      const results = await Results.find({userId: (<any>req).user._id});
      return res.json(results);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getFavoriteResults: async (req: Request, res: Response) => {
    try {
      const results = await Results.find({userId: (<any>req).user._id});
      const favoriteResults = results.filter(item => {return item.isFavorite});
      return res.json(favoriteResults);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  favoriteResult: async (req: Request, res: Response) => {
    try {
      let result = await Results.findById(ObjectId((<any>req).params.id)) || await Results.findOne({name: req.body.id.name});
      if(result) {
        result.isFavorite = !result?.isFavorite;
        await result?.save();
      } else {
        const result = new Results({...req.body.id, userId: (<any>req).user._id, isFavorite: true});
        await result.save()
      }
      const results = await Results.find({userId: (<any>req).user._id});
      return res.json(results);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unfavoriteResult: async (req: Request, res: Response) => {
    try {
      let result = await Results.findById((<any>req).params.id);
      if(result) {
        result.isFavorite = !result?.isFavorite;
      }
      await result?.save();
      const results = await Results.find({userId: (<any>req).user._id, isFavorite: true});
      return res.json(results);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  saveResults: async (req: Request, res: Response) => {
    console.log(req.body);
    const { data } = req.body;
    try {
      // if ( !title || !nodeAddress)
      //   return res.status(400).json({ msg: "Please fill in all fields." });
      const insert_data = data.map((item: any) => {
        item['userId'] = (<any>req).user._id;
        item['isFavorite'] = false;
        return item;
      })

      Results.insertMany(data)
            .then(result => {
              return res.json("Saved Successfully");
            })
            .catch(error => {
              console.error('Error inserting results:', error);
            })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  export: async (req: Request, res: Response) => {
    const { data } = req.body;

    //mockup data
    // const data = [
    //   {name: "Dublin Ruffer", industry: "Roofing", country: "Irish", address: "36 Street Dublin Ireland", phone: "+223 1234142423", email: "123qwe@gmail.com", website: "https://www.irishroofs.com", googleReviewRating: "5"},
    //   {name: "Dublin Ruffer", industry: "Roofing", country: "Irish", address: "36 Street Dublin Ireland", phone: "+223 1234142423", email: "123qwe@gmail.com", website: "https://www.irishroofs.com", googleReviewRating: "5"},
    //   {name: "Dublin Ruffer", industry: "Roofing", country: "Irish", address: "36 Street Dublin Ireland", phone: "+223 1234142423", email: "123qwe@gmail.com", website: "https://www.irishroofs.com", googleReviewRating: "5"},
    //   {name: "Dublin Ruffer", industry: "Roofing", country: "Irish", address: "36 Street Dublin Ireland", phone: "+223 1234142423", email: "123qwe@gmail.com", website: "https://www.irishroofs.com", googleReviewRating: "5"},
    //   {name: "Dublin Ruffer", industry: "Roofing", country: "Irish", address: "36 Street Dublin Ireland", phone: "+223 1234142423", email: "123qwe@gmail.com", website: "https://www.irishroofs.com", googleReviewRating: "5"}
    // ];
    try {

      const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../config/google_sheet.json'), // Adjust the path as needed
        scopes: [
                  'https://www.googleapis.com/auth/spreadsheets',
                  'https://www.googleapis.com/auth/drive'
                ],
      });
      const client = await auth.getClient();
      const sheets = google.sheets({ version: 'v4', auth: client as any });
      const drive = google.drive({ version: 'v3', auth: client as any });
      const resource = {
        properties: {
          title: 'My New Search result', // Change the title as needed
        },
        sheets: [{
          properties: {
            title: 'Result', // Change the sheet title as needed
          },
        }],
      };
  
      const response = await sheets.spreadsheets.create({
        requestBody: resource,
      });
      const spreadsheetId = response.data.spreadsheetId as string | undefined;

      await drive.permissions.create({
        requestBody: {
          role: 'reader', // Role of the user (reader means anyone can view)
          type: 'anyone', // Allows anyone to view the sheet
        },
        fileId: spreadsheetId,
        fields: "id",
      });

      const range = 'Result!A1' as string | undefined;; // Adjust the range as needed
      
      const rows = data.map((item: any, index: number) => [
        index + 1,
        item.name,
        item.industry,
        item.formatted_address,
        item.phoneNumber,
        item.email,
        item.website,
        item.rating,
      ]);
      // Write data to the sheet
      await sheets.spreadsheets.values.update({
        auth: client as any,
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['No', 'Name', 'Industry', 'Address', 'Phone Number', 'Email', 'Website', 'Google Review Rating']],
        },
      });

      // Append a new row
      await sheets.spreadsheets.values.append({
        auth: client as any,
        spreadsheetId,
        range: 'Result!A2', // Adjust as necessary
        valueInputOption: 'RAW',
        requestBody: {
          values: rows,
        },
      });

      const requests = [
        {
          updateCells: {
            rows: [
              {
                values: [
                  { userEnteredValue: { stringValue: 'No' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
                  { userEnteredValue: { stringValue: 'Name' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
                  { userEnteredValue: { stringValue: 'Industry' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
                  { userEnteredValue: { stringValue: 'Address' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
                  { userEnteredValue: { stringValue: 'Phone' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
                  { userEnteredValue: { stringValue: 'Email' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
                  { userEnteredValue: { stringValue: 'Website' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
                  { userEnteredValue: { stringValue: 'Google Review Rating' }, userEnteredFormat: { backgroundColor: { red: 0.1, green: 0.3, blue: 0.5 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } }},
      
                  // Add more cell formatting here if needed
                ],
              },
            ],
            range: {
              sheetId: response.data.sheets && response.data.sheets[0].properties ? response.data.sheets[0].properties.sheetId : undefined, // Use the created sheet's ID
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 9, // Adjust this based on the number of columns
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        },
      ];
  
      // Send the batchUpdate request to set the background color
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests,
        },
      });

      console.log(`Spreadsheet created: ${response.data.spreadsheetUrl}`);
      return res.status(200).json({url: response.data.spreadsheetUrl});
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  }
  

};
export default resultController;
