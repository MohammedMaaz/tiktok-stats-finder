# TikTok Stats Finder

### A TikTok stats finder application based on username

## Important Note:

The backend is deployed on a serverless vercel edge function and uses puppeteer for scraping to collect and aggregate data. Since, serverless functions have a cold start and scraper takes time to execute, the function sometimes timeout due to short timeout limit (10 secs) of vercel's free plan.

The frontend retries these failed calls, therefore, it may take a significant time duration to generate stats. However, once stats are generate, they are cached for the next 30 secs and the subsequent calls are very fast.

For standalone URLs, there's same situation when the username is not cached. However, in this case, since there's a limit before which a page can be server rendered and resolved by Vercel, retrying is beyond control and thus it gives 504 errors for uncached usernames once. However, refreshing the page for the same URL will then result in success.

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

The `/stats/<username>` page is server rendered for SEO purposes, considering it's a public URL. While navigating from the form page to stats page, the stats API is called first to fetch the data and validate user's existence on TikTok. The data is then stored in Redux state and is accessed by the stats page after client side navigation. Client side navigation in addition to keeping server rendering for standalone URLs is only possible by the user of `getInitialProps` instead of `getServerSideProps` (see: https://github.com/vercel/next.js/discussions/32243). Since the page is server rendered, unique URLs render unique stats pages. The server rendering is further optimized by the user of cache based scraping API as mentioned above.

#### API Retries

The calls to stats API are retried on Network errors or 5xx status codes. This is an intentional decision to cater random API failures due to Vercel timeouts. The cause for vercel timeouts is already mentioned at the beginning.
