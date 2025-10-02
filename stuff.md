CURRENTLY WORKING ON

FRONTEND

---------------------------------------------------------------------



TAG POINTS ALONG TO MEME RATING?


//222// CURRENTLY USED BY TEST PAGE, TO BE TRIGGERED BY USER RATE ATTEMPT AND SERVER START
router.get("/meme-count", async (req, res) => {})


implement, dont add duplicate meme

write cloudinary link to airtable and cache

remove file from cloudinary retry upload if file too large

 [maybe dont need] implement - get unrated memes worker ???

figure a way to dynamically add unique subreddit cat to table


implement - all cache context

implement - animation for pages

PULLING MEMES FROM UNRATED CACHE and AT, if pull  AT, to set to cache. [ALL THIS TO BE DONE BY WORKER]


USERDATA IS CURRENTLY PULLED FROM AIRTABLE AND NOT CACHE
POST USER ONLY SENDS TO AIRTABLE, CACHE NOT UPDATED WITH USER DATA
MAY NEED A CONTROLLER TO HANDLE POST & HSET


NSFW filter and research if true

server pulls and stores memes into airtable (when unrated <10, add 5 new memes, to be checked and performed when
                            [server starts // user rates a meme] )





--------------------------------------------------------------------


(DONE) redis to queue server to add 10 memes to airtable+cloudinary

 store 10 (post link, url as image) to cloudinary

get 10 cloudinary image link based on url

store (payload) to airtable



---------------------------------------------------------------------

home = all rated memes
-- -- sidebar for filtering through subreddit


unseen = new memes
(DONE) -- -- unseen page to only load a max amount


leaderboard = ranking of user points
                            [monthly, all time]
-- -- leaderboard top 3? grpahics?
-- -- name, points


--------------------------------------------------------------------
STRETCH?

SHOP TO BUY STUFF, STUFF TO BE DISPLAYED ON PROFILE?



----------------------------------------------------------------------

features on the meme
(DONE)- rate 1-5 stars
- favorite onto profile
- flag as innapropriate
- comment?

(DONE) after rating,
(DONE) if unseen, +5pts
(DONE) if seen, +2pts


(DONE) scroll bottom threshold load memes?

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


!!!!!! do now - userdata
----- building get records from airtable module


use table id in server env

UserData context

MEME API NOT RETURNING CORRECT NUMBER OF MEMES!

pull users ratings for memes to load stars for already rated memes

UNRATED MEME RATING!!!!!!!!!!!!!!!! finish up if unrated not in cache


work on rating rated meme
//222// UPDATE MEME RATING IF ALREADY RATED

ADD POINTS TO RATING UNRATED MEME

sort rated memes by created_at