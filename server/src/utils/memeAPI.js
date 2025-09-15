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
      throw new Error(`Meme API error: ${response.status}`);
    }

    const data = await response.json();
    const payload = {status: "success", memes: data.memes,};
    return payload;

    } catch (e) {
        console.error("meme retrieval failed:", e);
        throw e;
    }
}