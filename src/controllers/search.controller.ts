import { Request, Response } from "express";
import axios from "axios";
import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";

import {
  GOOGLE_API_KEY,
  GOOGLE_SEARCH_ENGINE_ID,
} from "../config";

const searchController = {

  search: async (req: Request, res: Response) => {
    // Replace with your Google Custom Search API key and search engine ID
    const API_KEY = GOOGLE_API_KEY;
    const CX = GOOGLE_SEARCH_ENGINE_ID;
    const query = req.query.q; // Get search query from request
    
    if (!query) {
        return res.status(400).send('Query parameter "q" is required.');
      }
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}`;

    try {
      const response = await axios.get(googleSearchUrl);
      const searchResults = response.data.items;
      console.log("this is the all search result ======================> ", searchResults);

      if (searchResults && searchResults.length > 0) {
          const firstResultUrl = searchResults[3].link; // Get the first result URL
          // Step 2: Scrape data from the first URL
          const scrapedData = await scrapeWebsite(firstResultUrl);

          res.json({
              searchQuery: query,
              firstResultUrl: firstResultUrl,
              scrapedData: scrapedData
          });
      } else {
          res.status(404).send('No search results found.');
      }
    } catch (error) {
        console.error('Error during search or scraping:', error);
        res.status(500).send('Error fetching search results or scraping the website.');
    }
  },

  // scrapeWithPuppeteer: async (url: any) => {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.goto(url);

  //   const scrapedData = await page.evaluate(() => {
  //       const title = document.querySelector('title').innerText;
  //       const firstParagraph = document.querySelector('p') ? document.querySelector('p').innerText : 'No paragraph found';

  //       return { title, firstParagraph };
  //   });

  //   await browser.close();
  //   return scrapedData;
  // }
}
export default searchController;


async function scrapeWebsite(url: any) {
  try {
    console.log("this is the srcaping url ================> ", url)
    const { data } = await axios.get(url); // Get the HTML from the website
    const $ = cheerio.load(data); // Load HTML into Cheerio for parsing

    // Example: Get the title and first paragraph from the page
    const title = $('title').text();
    const firstParagraph = $('p').first().text();

    return { title, firstParagraph };
  } catch (error) {
      console.error('Error scraping the website:', error);
      return { error: 'Failed to scrape the website' };
  }
}