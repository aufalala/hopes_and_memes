import { cloudinary } from '../config.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

import getTimestamp from '../utils/utTimestamp.js';

// Download image from URL using https
async function downloadImageToFile(sourceData, url, index) {
  console.log(`[${getTimestamp()}] TRYING: downloadImageToFile from ${sourceData}, [${index}]`);

  // Create a temporary file path in the OS's temp directory
  const tempPath = path.join(os.tmpdir(), path.basename(url.split('?')[0]));
  // Create a writable file stream to write the downloaded image to disk
  const file = fs.createWriteStream(tempPath);

  try {
    await new Promise((resolve, reject) => {
      console.log(`[${getTimestamp()}] downloadImageToFile: DOWNLOADING: [${index}] ${url}`)
      // Start downloading the image using HTTPS
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`[${getTimestamp()}] downloadImageToFile: DOWNLOAD FAILED: [${index}] ${response.statusCode} for ${url}`));
        }

        
        console.log(`[${getTimestamp()}] downloadImageToFile: SAVING: [${index}] ${url}`);
        // Downloaded img goes into stream path
        response.pipe(file);
        file.on('finish', () => {
          // Resolve when file stream is closed
          file.close(resolve); 
          console.log(`[${getTimestamp()}] downloadImageToFile: SAVE SUCCESS: [${index}] ${url}`);
        });
      }).on('error', (err) => {
        console.log(err)
        // Delete temp file on error
        console.log(`[${getTimestamp()}] downloadImageToFile: DELETING: [${index}] ${tempPath}`);
        fs.unlink(tempPath, () => reject(err)); 
        console.log(`[${getTimestamp()}] downloadImageToFile: DELETED: [${index}] ${tempPath}`);
      });
    });

    return tempPath;
  } catch (err) {
    // Clean up written file if an error occurred
    
    console.log(`[${getTimestamp()}] downloadImageToFile: DELETING PARTIAL WRITE: [${index}] ${tempPath}`);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
      console.log(`[${getTimestamp()}] downloadImageToFile: DELETED PARTIAL WRITE: [${index}] ${tempPath}`);
    }
    throw err;
  }
}

// Upload single meme
async function processMemeUpload(sourceData, meme, index) {
  
  console.log(`[${getTimestamp()}] TRYING: processMemeUpload from ${sourceData}, [${index}]`);
  let localImagePath;

  try {
    // downloadImageToFile returns img file path
    localImagePath = await downloadImageToFile(sourceData, meme.url, index);

    // upload to cloudinary
    console.log(`[${getTimestamp()}] processMemeUpload: UPLOADING: [${index}] ${localImagePath}`)
    const uploadResult = await cloudinary.uploader.upload(localImagePath, {
      folder: 'reddit_memes/',
      context: `postLink=${meme.postLink}`,
      use_filename: true,
      unique_filename: false,
      resource_type: 'image'
    });

    console.log(`[${getTimestamp()}] processMemeUpload: UPLOADED: [${index}] ${localImagePath}`)
    return {
      success: true,
      originalPostLink: meme.postLink,
      cloudinary_url: uploadResult.secure_url,
    };

  } catch (error) {
    console.log(`[${getTimestamp()}] processMemeUpload: FAILED: [${index}] ${localImagePath} ${error.message}`)
    return {
      success: false,
      originalPostLink: meme.postLink,
      error: error.message
    };
  } finally {
    // Delete temp file
    if (localImagePath && fs.existsSync(localImagePath)) {
      
      console.log(`[${getTimestamp()}] processMemeUpload: CLEARING: [${index}] ${localImagePath}`);
      fs.unlinkSync(localImagePath);
      console.log(`[${getTimestamp()}] processMemeUpload: CLEARED: [${index}] ${localImagePath}`);
    }
  }
}

// Upload all memes in parallel
export async function uploadMemesToCloudinary(sourceData, memeArray, maxRetries = 5) {
  console.log(`[${getTimestamp()}] TRYING: uploadMemesToCloudinary from ${sourceData}`);
  let memesToUpload = memeArray;
  let allResults = [];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (memesToUpload.length === 0) break;
    console.log("##################################################################################################");
    console.log(`[${getTimestamp()}] uploadMemesToCloudinary: Attempt ${attempt + 1} of ${maxRetries + 1}`);
    console.log("##################################################################################################");

    const results = await Promise.all(memesToUpload.map((meme, index) => processMemeUpload(sourceData, meme, index+1)));

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
      console.warn(`[${getTimestamp()}] uploadMemesToCloudinary: Retrying ${memesToUpload.length} failed uploads...`);
    }
  }

  const failed = memeArray.filter(meme => !allResults.some(r => r.originalPostLink === meme.postLink));

  console.log(`[${getTimestamp()}] uploadMemesToCloudinary: UPLOADED: ${allResults.length}`);
  console.log(`[${getTimestamp()}] uploadMemesToCloudinary: FAILED: ${failed.length}`);

  if (failed.length > 0) {
    console.warn(`[${getTimestamp()}] uploadMemesToCloudinary: Some uploads failed after retries:`);
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