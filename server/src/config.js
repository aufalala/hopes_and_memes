import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";


export const AIRTABLE_URL = process.env.AIRTABLE_URL;
export const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

export const AIRTABLE_T_UNRATED_MEMES = process.env.AIRTABLE_T_UNRATED_MEMES;
export const AIRTABLE_T_RATED_MEMES = process.env.AIRTABLE_T_RATED_MEMES;
export const AIRTABLE_T_ALL_USERS = process.env.AIRTABLE_T_ALL_USERS;
export const AIRTABLE_T_MEME_RATINGS = process.env.AIRTABLE_T_MEME_RATINGS;
export const AIRTABLE_T_TEST_TABLE = process.env.AIRTABLE_T_TEST_TABLE;
export const AIRTABLE_T_IMAGE_TEST = process.env.AIRTABLE_T_IMAGE_TEST;


export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
export { cloudinary };
