
export async function postCloudinary(sourceData) {
  console.log(`[${new Date().toISOString()}] TRYING: postCloudinary from ${sourceData}`);
  try {
    return {
      status: "success"
    }
  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}







import { v2 as cloudinary } from 'cloudinary';
import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Download image from URL using https
async function downloadImageToFile(sourceData, url) {
  console.log(`[${new Date().toISOString()}] TRYING: downloadImageToFile from ${sourceData}`);

  // Create a temporary file path in the OS's temp directory
  const tempPath = path.join(os.tmpdir(), path.basename(url.split('?')[0]));
  // Create a writable file stream to write the downloaded image to disk
  const file = fs.createWriteStream(tempPath);

  try {
    await new Promise((resolve, reject) => {
      console.log(`[${new Date().toISOString()}] downloadImageToFile: DOWNLOADING: ${url}`)
      // Start downloading the image using HTTPS
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`[${new Date().toISOString()}] downloadImageToFile: DOWNLOAD FAILED: ${response.statusCode} for ${url}`));
        }

        
        console.log(`[${new Date().toISOString()}] downloadImageToFile: SAVING: ${url}`);
        // Downloaded img goes into stream path
        response.pipe(file);
        file.on('finish', () => {
          // Resolve when file stream is closed
          file.close(resolve); 
          console.log(`[${new Date().toISOString()}] downloadImageToFile: SAVE SUCCESS: ${url}`);
        });
      }).on('error', (err) => {
        console.log(err)
        // Delete temp file on error
        console.log(`[${new Date().toISOString()}] downloadImageToFile: DELETING: ${tempPath}`);
        fs.unlink(tempPath, () => reject(err)); 
        console.log(`[${new Date().toISOString()}] downloadImageToFile: DELETED: ${tempPath}`);
      });
    });

    return tempPath;
  } catch (err) {
    // Clean up written file if an error occurred
    
    console.log(`[${new Date().toISOString()}] downloadImageToFile: DELETING PARTIAL WRITE: ${tempPath}`);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
      console.log(`[${new Date().toISOString()}] downloadImageToFile: DELETED PARTIAL WRITE: ${tempPath}`);
    }
    throw err;
  }
}

// Upload single meme
async function processMemeUpload(sourceData, meme) {
  
  console.log(`[${new Date().toISOString()}] TRYING: processMemeUpload from ${sourceData}`);
  let localImagePath;

  try {
    // downloadImageToFile returns img file path
    localImagePath = await downloadImageToFile(sourceData, meme.url);

    // upload to cloudinary
    console.log(`[${new Date().toISOString()}] processMemeUpload: UPLOADING ${localImagePath}`)
    const uploadResult = await cloudinary.uploader.upload(localImagePath, {
      folder: 'reddit_memes/',
      context: `postLink=${meme.postLink}`,
      use_filename: true,
      unique_filename: false,
      resource_type: 'image'
    });

    console.log(`[${new Date().toISOString()}] processMemeUpload: UPLOADED: ${localImagePath}`)
    return {
      success: true,
      originalPostLink: meme.postLink,
      cloudinary_url: uploadResult.secure_url,
    };

  } catch (error) {
    console.log(`[${new Date().toISOString()}] processMemeUpload: FAILED: ${localImagePath} ${error.message}`)
    return {
      success: false,
      originalPostLink: meme.postLink,
      error: error.message
    };
  } finally {
    // Delete temp file
    if (localImagePath && fs.existsSync(localImagePath)) {
      
      console.log(`[${new Date().toISOString()}] processMemeUpload: CLEARING: ${localImagePath}`);
      fs.unlinkSync(localImagePath);
      console.log(`[${new Date().toISOString()}] processMemeUpload: CLEARED: ${localImagePath}`);
    }
  }
}

// Upload all memes in parallel
export async function uploadMemesToCloudinary(sourceData, memeArray, maxRetries = 5) {
  console.log(`[${new Date().toISOString()}] TRYING: uploadMemesToCloudinary from ${sourceData}`);
  let memesToUpload = memeArray;
  let allResults = [];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (memesToUpload.length === 0) break;

    console.log(`[${new Date().toISOString()}] uploadMemesToCloudinary: Attempt ${attempt + 1} of ${maxRetries + 1}`);

    const results = await Promise.all(memesToUpload.map(meme => processMemeUpload(sourceData, meme)));

    const newSuccesses = results.filter(r => r.success);
    const successfulLinks = newSuccesses.map(r => r.originalPostLink);

    // Update meme data and results
    allResults = [
      ...allResults.filter(r => !successfulLinks.includes(r.originalPostLink)),
      ...newSuccesses
    ];


    // Retry failed memes
    memesToUpload = results
      .filter(r => !r.success)
      .map(r => memeArray.find(m => m.postLink === r.originalPostLink));

    if (memesToUpload.length > 0) {
      console.warn(`[${new Date().toISOString()}] uploadMemesToCloudinary: Retrying ${memesToUpload.length} failed uploads...`);
    }
  }

  const failed = memeArray.filter(meme => !allResults.some(r => r.originalPostLink === meme.postLink));

  console.log(`[${new Date().toISOString()}] uploadMemesToCloudinary: UPLOADED: ${allResults.length}`);
  console.log(`[${new Date().toISOString()}] uploadMemesToCloudinary: FAILED: ${failed.length}`);

  if (failed.length > 0) {
    console.warn(`[${new Date().toISOString()}] uploadMemesToCloudinary: Some uploads failed after retries:`);
    console.table(failed);
  }

  // Add cloudinary URL to meme data object
  const finalMemesData = memeArray.map((meme) => {
    const uploaded = allResults.find(r => r.originalPostLink === meme.postLink);
    return {
      ...meme,
      cloudinary_url: uploaded?.cloudinary_url || null
    };
  });

  const returnPayload = {status: "success", finalMemesData}

  return returnPayload;
}