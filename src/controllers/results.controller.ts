import { Request, Response } from "express";
import { google } from "googleapis";
import path from "path";

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
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../config/google_sheet.json'), // Adjust the path as needed
      scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
              ],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const drive = google.drive({ version: 'v3', auth: client });
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
  
    try {
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
        auth: client,
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['No', 'Name', 'Industry', 'Address', 'Phone Number', 'Email', 'Website', 'Google Review Rating']],
        },
      });

      // Append a new row
      await sheets.spreadsheets.values.append({
        auth: client,
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
