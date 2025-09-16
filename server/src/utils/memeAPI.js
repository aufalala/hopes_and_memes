const memeApiUrl = "https://meme-api.com/gimme";

export async function getRandomMeme(sourceData) {
  console.log(`[${new Date().toISOString()}] TRYING: getRandomMeme from ${sourceData}`);
    try {
      const response = await fetch(memeApiUrl)
    if (!response.ok) {
      throw new Error(`Meme API error: ${response.status}`);
    }

    const data = await response.json();
    const {postLink, subreddit, title, url, nsfw, spoiler, author, ups, preview} = data;
    const payload = {
                        status: "success",
                        postLink: postLink,
                        subreddit: subreddit,
                        title: title,
                        url: url,
                        nsfw: nsfw,
                        spoiler: spoiler,
                        author: author,
                        ups: ups,
                        preview: preview,
                    }
    return payload;

    } catch (e) {
      console.error("meme retrieval failed:", e);
      throw e;
    }
}

export async function getTenMemes(sourceData) {
  console.log(`[${new Date().toISOString()}] TRYING: getTenMemes from ${sourceData}`);
    try {
    const response = await fetch(`${memeApiUrl}/10`)
    if (!response.ok) {
      throw new Error(`[${new Date().toISOString()}] getTenMemes: Meme API error: ${response.status}`);
    }

    const data = await response.json();
    
    // get more memes if API returned <10
    while (data.memes.length <10) {
      console.log(`[${new Date().toISOString()}] getTenMemes: Memes less than 10, count: data.memes.length`);
      try {
        const memeRetry = await fetch(`${memeApiUrl}/${10-data.memes.length}`)
        if (!memeRetry.ok) {
          throw new Error(`[${new Date().toISOString()}] getTenMemes: Meme API retry error: ${memeRetry.status}`);
        }
        const retryData = await memeRetry.json();
        data.memes = [...data.memes, retryData.memes]
      
      } catch (e) {
        console.error(`[${new Date().toISOString()}] getTenMemes: Meme retrieval failed:`, e);
        throw e;
      }

    }
    const payload = {status: "success", memes: data.memes,};
    console.log(`[${new Date().toISOString()}] getTenMemes: Meme count: ${payload.memes.length}`)
    return payload;

    } catch (e) {
      console.error(`[${new Date().toISOString()}] getTenMemes: Meme retrieval failed:`, e);
      throw e;
    }
}