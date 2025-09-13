SAVE USER INFO INTO AIRTABLE (when new user is created, after signup complete, fetch a post to server,
                            on server use await clerkClient.users.getUser(userId) and post to AT#)


split RESTFUL routing for syncing user info


server pulls and stores memes into airtable (when unrated <10, add 5 new memes, to be checked and performed when
                            [server starts // user rates a meme] )

standardize modal providers

use table id in server env

---------------------------------------------------------------------
home = all rated memes
-- -- sidebar for filtering through subreddit


unseen = new memes
-- -- sidebar for search through predefined subreddit search


leaderboard = ranking of user points
                            [monthly, all time]

----------------------------------------------------------------------

features on the meme
- rate 1-5 stars
- favorite onto profile
- flag as innapropriate
- comment?

after rating,
if unseen, +5pts
if seen, +2pts


scroll bottom threshold load memes?
cache 5 memes?


----------------------------------------

modal for TIME JUMP warning and lore

login modal to make nicer


NSFW filter and research if true

make client and server fetches modular



-------------------------------------------



leaderboard top 3? grpahics?
name, points


logo for site?

icons for nav?