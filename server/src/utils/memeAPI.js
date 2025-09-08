const memeApiUrl = "https://meme-api.com/gimme";

export async function getRandomMeme() {
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

    } catch (err) {
        console.error("meme retrieval failed:", err);
        return { status: "failed", message: err.message };
    }
}