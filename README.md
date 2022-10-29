# TikTok Stats Finder

### A TikTok stats finder application based on username

## Important Note:

The backend is deployed on a serverless vercel edge function and uses puppeteer for scraping to collect and aggregate data. Since, serverless functions have a cold start and scraper takes time to execute, the function sometimes timeout due to short timeout limit (10 secs) of vercel's free plan.

The frontend retries these failed calls, therefore, it may take a significant time duration to generate stats. However, once stats are generate, they are cached for the next 30 secs and the subsequent calls are very fast.

## Running Locally

- `yarn install`
- `yarn dev-vercel` (project needs to run through vercel CLI instead of next CLI as the stats API is a vercel route and not a NextJS serverless function)

## Implementation Details

#### Data Collection Technique

The stats collection API employs a puppeteer based webscraper to extract data from TikTok website's `SIGI_STATE` variable.
Inspired From: https://github.com/slouchd/tiktok-scraper-selenium

#### Running Puppeteer on Serverless

API is deployed on vercel's edge network and employs a serverless version of chromium to run puppeteer.
More Details: https://gist.github.com/kettanaito/56861aff96e6debc575d522dd03e5725

#### Caching Technique

API response is cached on edge for 30 secs, thanks to Vercel's Cache-Control headers. Therefore, no persistent storage is used to store results as it required extra configuration and seemed redundant.
More Details: https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching

#### Persistent URLs and Navigation

The `/stats/<username>` page is server rendered for SEO purposes, considering it's a public URL. While navigating from the form page to stats page, the stats API is called first for 2 reasons:

1.  To validate user's existence on TikTok and display errors if it's not
2.  To cache the API response on edge, so that the subsequent request made by `getServerSideProps` is instantaneous and requires no further delay

#### Stats Grid

The grid shown on stats page is based on css grid styles to keep it completely responsive across all device types. This however sacrifices the Figma design to some extent as the design provided was not developer friendly, especially in case of responsive screens.

#### API Retries

The calls to stats API are retries on Network errors or 5xx status codes. This is an intentional decision to cater random API failures due to Vercel timeouts. The cause for vercel timeouts is already mentioned at the beginning.

#### Hinting/Suggestive Input (for username)

This was a tricky design and involved some css hacking to pull off. The hinted text of "_username_" is underlapped in the input field with same font stylings to provide that affect.
Inspired From: https://codingartistweb.com/2022/01/predictive-text-on-input-fields-html-css-javascript/

## Challenges

1. The most challenging and time taking part was to figure out the stats collection technique from TikTok. I initially checked for an official API which wasn't available. Then there was an unofficial implementation in Python (https://github.com/davidteather/TikTok-Api). I spent a fair amount of time to setup Python enviornment and creating a serverless Python function on vercel, but turned out the implementation was buggy, primarily because Tiktok's captch challenges. Then I found a python scraper on selinium (https://github.com/slouchd/tiktok-scraper-selenium) which I got working locally. And after analyzing it's code I created my own scrapper in NodeJS using a similar technique. Overall it was a lot of trial and error and RnD and took the most time.
2. Another comparitively smaller challenge was to run puppeteer in a serveless enviornment. I wanted to use Vercel to keep the codebase in a single repo and also to avoid renting a whole VM. However, standard puppeteer version can't run on serverless. After figuring out a serverless version of chromuim there was still some work to do as Vercel has a limitation on the bundle size and timeouts. I found help online on this form these links: https://github.com/vercel/community/discussions/124 and https://gist.github.com/kettanaito/56861aff96e6debc575d522dd03e5725
3. The Figma design apprently shows the two screens as states of a single page. For example, before going to the stats page, the stats are fetched and user's existence is validated on the form page. Which means, if we go to the stats page which has it's own unique persistence URL, then fetching data prior on the form screen was redundant. The only way to avoid this redundancy is to fetch data on form page then pass it to the stats page. However, since the stats page has to be server rendered and independent, this can't be done. In the end I sort of merged the server rendering and prior data fetching. While navigating from form to stats page, still one redundant API call is made but the edge cache helps to avoid at least computation redundancy.
4. The design of grid on stats page seems to be not analyzed from implementation's perspective. The grid cells lack uniformity and the cell borders are not generic. Since the grid needs to be responsive by dropping columns on small screens, there's apprently no way to write css to design according to Figma in a generic way. Therefore, at last I have deviated from the Figma design a bit on this to keep things non-hacky and generic.

## Learning

1.  I had an abstract idea of how a scraper works, but for the firs time I wrote a web scraper form scratch and learned challenges and workarounds this process comes with.
2.  Learned how to run chromuim and eventually pupeteer or any other headless browser in a serveless enviornement.
3.  First time worked on a project with Tailwind. Although I was familiar with it but haven't used it before. Although it takes some time to get used to, but I loved it eventually.
4.  While trying to run python scrapers locally, I as a side effect learned how to configure vercel to run serverless functions with different run times in a same project. I didn't knwe before that it was possible. And to be honest it's super cool!
