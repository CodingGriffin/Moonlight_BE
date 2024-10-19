import { Request, Response } from "express";
import axios from "axios";
import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";

import {
  GOOGLE_API_KEY,
  GOOGLE_SEARCH_ENGINE_ID,
} from "../config";

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
    const API_KEY = GOOGLE_API_KEY;
    const CX = GOOGLE_SEARCH_ENGINE_ID;
    const query = req.query.q; // Get search query from request
    const resultCount = req.query.num || 20
    const num = Number(resultCount) * 3;
    if (!query) {
        return res.status(400).send('Query parameter "q" is required.');
      }

    try {
      const searchResults: GoogleSearchResult[] = [];
      let startIndex = 1;
      // https://maps.googleapis.com/maps/api/place/textsearch/json?query=roofer+ireland+dublin&key=AIzaSyD8pk2ZnpR82LXx3IJUXFbaRnhZ27hR4ZY
      // const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`);
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`);
      res.json({
        searchQuery: query,
        scrapedData: response.data.results,//scrapedData.slice(0, Number(resultCount))
        count: response.data.results.length
      });
      // while (searchResults.length < num) {
      //   const temp_num = Math.min(num - searchResults.length, 10); // Max 10 results per request
      //   const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}&start=${startIndex}&num=${temp_num}`;
      //   try {
      //     const response = await axios.get(url);
      //     const items = response.data.items || [];

      //     items.forEach((item: any) => {
      //       searchResults.push({
      //         title: item.title,
      //         link: item.link,
      //         snippet: item.snippet,
      //       });
      //     });

      //     startIndex += 10; // Move to the next page of results
      //   } catch (error) {
      //     console.error("Error fetching search results", error);
      //     break;
      //   }
      // }

      // if (response && searchResults.length > 0) {
      //   const scrapedData: any[] = [];
      //   for(let i = 0 ; i < searchResults.length ; i++){
      //     const result = await scrapeWebsite(searchResults[i].link);
      //     if(!result.error) scrapedData.push(await scrapeWebsite(searchResults[i].link));
      //   }

      //   res.json({
      //     searchQuery: query,
      //     scrapedData: response//scrapedData.slice(0, Number(resultCount))
      //   });
      // } else {
      //   res.status(404).send('No search results found.');
      // }

    } catch (error) {
      console.error('Error during search or scraping:', error);
      res.status(500).send('Error fetching search results or scraping the website.');
    }
  },
}
export default searchController;


async function scrapeWebsite(url: any) {
  try {
    const { data } = await axios.get(url); // Get the HTML from the website
    const $ = cheerio.load(data); // Load HTML into Cheerio for parsing

    // Example: Get the title and first paragraph from the page
    const title = $('title').text();
    const firstParagraph = $('p').first().text();
    // Extracting business data
    const name = $('h1.business-name').text() || ''; // Example selector
    const industry = $('div.industry-info').text() || ''; // Example selector
    const country = $('span.country-info').text() || ''; // Example selector
    const address = $('div.address-info').text() || ''; // Example selector
    const phone = $('a[href^="tel:"]').attr('href')?.replace('tel:', '') || ''; // Example selector
    const email = $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '') || ''; // Find email
    const website = $('a.website-link').attr('href') || '';
    const googleReviewRating = $('span.review-rating').text() || ''; // Example selector
    
    // Social media links extraction
    const socialLinks: string[] = [];
    $('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]').each((_, element) => {
        socialLinks.push($(element).attr('href') || '');
    });

    return { title, firstParagraph, url, name, industry, country, address, phone, email, website, googleReviewRating };
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