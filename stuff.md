CURRENTLY WORKING ON

PULLING MEMES FROM UNRATED CACHE and AT, if pull  AT, to set to cache. [ALL THIS TO BE DONE BY WORKER]

UNRATED MEME RATING


---------------------------------------------------------------------

remove file from cloudinary retry upload if file too large

implement - get unrated memes from airtable (THEN) fill cache

implement - get unrated memes worker

implement - all cache context

implement - animation for pages




NSFW filter and research if true

server pulls and stores memes into airtable (when unrated <10, add 5 new memes, to be checked and performed when
                            [server starts // user rates a meme] )

use table id in server env

UserData context - for profile and comments?


MEME API NOT RETURNING CORRECT NUMBER OF MEMES!


--------------------------------------------------------------------

redis to queue server to add 10 memes to airtable+cloudinary

store 10 (post link, url as image) to cloudinary

get 10 cloudinary image link based on url

store (payload) to airtable



---------------------------------------------------------------------

home = all rated memes
-- -- sidebar for filtering through subreddit


unseen = new memes
-- -- unseen page to only load a max amount


leaderboard = ranking of user points
                            [monthly, all time]
-- -- leaderboard top 3? grpahics?
-- -- name, points


--------------------------------------------------------------------
STRETCH?

SHOP TO BUY STUFF, STUFF TO BE DISPLAYED ON PROFILE?



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


make client and server fetches modular?



-------------------------------------------



logo for site?

icons for nav?


-----------------------------------

DONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONE
DONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONE

SAVE USER INFO INTO AIRTABLE (when new user is created, after signup complete, fetch a post to server,
                            on server use await clerkClient.users.getUser(userId) and post to AT#)

split RESTFUL routing for syncing user info

standardize modal providers context

decide if ten memes go into airtable first
