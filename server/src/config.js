import dotenv from "dotenv";
dotenv.config();

export const AIRTABLE_URL = process.env.AIRTABLE_URL;
export const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;