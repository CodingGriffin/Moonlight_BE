import { Request, Response } from "express";
import { google, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
	REDIRECT_URI,
} from "../config";

import Emails from "../models/emails.model";

const emailController = {
	getEmailsAllInfor: async (req: Request, res: Response) => {
		try {
		  const results = await Emails.find({userID: (<any>req).user._id});
		  res.json(results);
		} catch (err: any) {
		  return res.status(500).json({ msg: err.message });
		}
	},
	sendEmail: async (req: Request, res: Response) => {
		try {
			const { recipientEmail, subject, message, accessToken, refreshToken } = req.body.data;
			console.log(req.body.data);
			// if (!(<any>req).user) return res.status(401).json({ msg: "User not authenticated" });

			// Assuming user's tokens are stored in the request session after login
			// const { accessToken, refreshToken } = (<any>req).user.tokens;

			const oAuth2Client = new OAuth2Client(
				GOOGLE_CLIENT_ID,
				GOOGLE_CLIENT_SECRET,
				REDIRECT_URI
			);

			const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
			
			// Set the user’s credentials with the access and refresh tokens
			oAuth2Client.setCredentials({
				access_token: accessToken,
				refresh_token: refreshToken,
			});

			const authUrl = oAuth2Client.generateAuthUrl({
				access_type: 'offline',
				scope: SCOPES,
			});

			const gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

			// Encode email content in Base64 for Gmail API
			const emailContent = [
				`To: ${recipientEmail}`,
				`Subject: ${subject}`,
				`MIME-Version: 1.0`,
				`Content-Type: text/plain; charset=UTF-8`,
				``,
				message,
			].join('\n');

			const encodedEmail = Buffer.from(emailContent)
				.toString('base64')
				.replace(/\+/g, '-')
				.replace(/\//g, '_');

			// Send email via Gmail API
			await gmail.users.messages.send({
				userId: 'me',
				requestBody: {
					raw: encodedEmail,
				},
			});

			const newEmail = new Emails({
				userID: (<any>req).user._id,
				recipient: recipientEmail,
				subject: subject,
				message: message,
			  });
		
			await newEmail.save();

			const results = await Emails.find({userID: (<any>req).user._id});
			return res.status(200).json(results);
		} catch (error: any) {
			console.error("Error sending email:", error);
			return res.status(500).json({ msg: error.message });
		}
	},
}
export default emailController;