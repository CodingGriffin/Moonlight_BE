import { Request, Response } from "express";
import axios from "axios";
import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";

import {
  GOOGLE_API_KEY,
  GOOGLE_SEARCH_ENGINE_ID,
} from "../config";
import sendEmail from "../services/sendMail";
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface BusinessInfo {
  name: string;
  industry: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: string[];
  website: string;
  googleReviewRating: string;
}

const searchController = {

  search: async (req: Request, res: Response) => {
    // Replace with your Google Custom Search API key and search engine ID
    const CX = GOOGLE_SEARCH_ENGINE_ID;
    const query: string = String(req.query.q); // Get search query from request
    const limit: number = Number(req.query.num) || 20
    const lat: number = Number(req.query.lat) || -34
    const lng: number = Number(req.query.lng) || 150
    const radius: number = Number(req.query.radius) * 1000 || 100000
    if (!query) {
        return res.status(400).send('Query parameter "q" is required.');
    }

    try {
      let result = await fetchBusinessInfo(query, limit, lat, lng, radius);
      result = await Promise.all(
        result.map(async (item) => {
          const otherData = await fetchBusinessOtherInfo(item.place_id);
          item['website'] = otherData.website || 'Website not available';
          item['phoneNumber'] = otherData.formatted_phone_number || 'Phone number not available';
          const scrapedData = await scrapeWebsite(otherData.website)
          item['email'] = scrapedData.email;
          item['socialLinks'] = scrapedData.socialLinks;
          return item;
        })
      );

      res.json({
        searchQuery: query,
        scrapedData: result,//scrapedData.slice(0, Number(resultCount))
        count: result.length
      });

    } catch (error) {
      console.error('Error during search or scraping:', error);
      res.status(500).send('Error fetching search results or scraping the website.');
    }
  },
}
export default searchController;

async function fetchBusinessOtherInfo(placeId: string) {
  const GOOGLE_PLACES_API_DETAIL_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
  const API_KEY = GOOGLE_API_KEY;

  const params = {
    place_id: placeId,
    key: API_KEY,
    fields: 'website,formatted_phone_number',
  };
  const response = await axios.get(GOOGLE_PLACES_API_DETAIL_URL, {
    params: params
  });
  const result = response.data.result;

  return result
}

async function fetchBusinessInfo(query: string, limit: number, lat: number, lng: number, radius: number) {
  let results: any[] = [];
  let nextPageToken: string | undefined;
  const API_KEY = GOOGLE_API_KEY;
  const GOOGLE_PLACES_API_TEXT_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(query)}&key=${API_KEY}`;

  const params = {
    pagetoken: ''
  };

  do {
      const response = await axios.get(GOOGLE_PLACES_API_TEXT_URL, { params });
      const data = response.data;

      results.push(...data.results);
      results = removeDuplicateResults(results);
      // Check if we have reached the limit
      if (results.length >= limit) {
          break;
      }

      // Check for next page token
      nextPageToken = data.next_page_token;

      // Wait for a bit before making the next request
      if (nextPageToken) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          params['pagetoken'] = nextPageToken; // Update params with next page token
      }
  } while (nextPageToken);

  // Return only the requested number of results
  return results.slice(0, limit);
}

async function scrapeWebsite(url: string) {
  try {
    const { data } = await axios.get(url); // Get the HTML from the website
    const $ = cheerio.load(data); // Load HTML into Cheerio for parsing

    const email = $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '') || ''; // Find email
    
    // Social media links extraction
    const socialLinks: string[] = [];
    $('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]').each((_, element) => {
        socialLinks.push($(element).attr('href') || '');
    });

    return { email, socialLinks };
  } catch (error) {
    return { error: 'Failed to scrape the website' };
  }
}

async function scrapeWithPuppeteer (url: any) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const scrapedData = await page.evaluate(() => {
    const title = document.querySelector('title')?.innerText;
    const firstParagraph = document.querySelector('p') ? document.querySelector('p')?.innerText : 'No paragraph found';

    return { title, firstParagraph, "url": url };
  });

  await browser.close();
  return scrapedData;
}

function removeDuplicateResults(results: any[]) {
  const uniqueResults = results.filter(
    (result, index, self) =>
      index === self.findIndex((r) => r.place_id === result.place_id)
  );
  return uniqueResults;
}