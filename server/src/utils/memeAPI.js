const memeUrl = "https://meme-api.com/gimme";

export async function getRandomMeme() {
    try {
    const response = await fetch(memeUrl)
    if (!response.ok) {
      throw new Error(`Meme API error: ${response.status}`);
    }

    const data = await response.json();
    const {postlink, subreddit, title, url, nsfw, spoiler, author, ups, preview} = data;

    return {postlink, subreddit, title, url, nsfw, spoiler, author, ups, preview};

    } catch (err) {
        console.error("meme failed:", err.message);
        return { status: "failed", message: err.message };
    }
}