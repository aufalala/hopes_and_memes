# HOPES AND MEMES   
  
## DESCRIPTION  
Hopes and Memes is a site based on a fictional future.  
  
***"AI is dead because AGI has been achieved and governs the world.  
It has left 1 job to the humans, rating memes, because machines can never truly "haha" or "LMAO".  
Humans compete for points, receiving more for rating memes never seen before.  
What are these points for? Nobody knows. But the primal instinct to have the most, fuels the site to come alive.  
What are these ratings for? Many suspect that the "Machines" are using all the collected data to learn.  
But the more it tries, the more it cries." -unknown***  
  
I would say that this little project is my first end-to-end fullstack web app.  
Building and integrating frontend, backend, and database.  
It was only supposed to be a React.js showcase, but it quickly grew into something bigger.  
  
*(React|Clerk|Express|Redis|BullMQ|Airtable|Cloudinary|...)*  

## SCREENSHOTS  
**HOME**  
<img width="3839" height="1882" alt="image" src="https://github.com/user-attachments/assets/39061d33-0859-43fb-bb48-088bd6dce387" />
  
## GETTING STARTED
**Note: This site was primarily developed and tested using Google Chrome on desktop.  
FOR THE BEST EXPERIENCE, USE GOOGLE CHROME ON DESKTOP!**  
  
**LINK:** https://aufalala.github.io/hopes_and_memes/#/  
*you've been warned to use desktop chrome :')*  
  
## SITE FEATURES  
User account creation/login. Progressive login/sign up menu.  
"Infinite" scroll paginated home page. Scroll aware header and sidebar.  
Meme rating - points awarded. Mutex via Redis to prevent first rater bonus race condition.  
First Rater = 5pts. Subsequent rater = 2pts.  
Global all time (points) leaderboard. Profile page through URL query.  
  
## ATTRIBUTIONS  
**Font:**  
Michroma  
*https://fonts.google.com/specimen/Michroma*

**Memes:**  
Reddit  
Reddit  
Reddit x1000  
  
**Development Inspirations:**  
9gag  
*https://9gag.com/*  

## TECHNOLOGIES USED  
HTML, CSS, Javascript  
  
**Frontend:**  
React (with React Router for routing)  
Clerk (for authentication and user management)  
CSS Modules (for styling)  
Framer Motion (for animations)  
  
**Backend:**  
Node.js (Express.js server)  
Redis (for "mutex", caching and data storage, using ioredis)  
BullMQ (for job/queue management)  
Airtable API (for primary database/source of truth)  
Cloudinary (for image storage fallback)  
  
**Other libraries/tools:**  
dotenv (for environment variables)  
node-fetch (for HTTP requests)  
dayjs (for date/time formatting)  
Clerk SDK and ClerkClient (for auth and user management)  
  
## FUTURE STEPS  
Docker and Docker Compose  
Comment, Share  
Optimistic UI for rating  
Duplicate meme handling  
Leaderboard timeframes & category  
Cloudinary image URL usage  
Shop to "redeem" items using points  

