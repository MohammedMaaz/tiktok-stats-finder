import chromium from "chrome-aws-lambda";
import { NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import { CACHE_MAX_AGE } from "../constants/api";
import { APIResponse } from "../common/types/api";
import { LOCAL_CHROME_EXECUTABLE } from "../constants/puppeteer";

export const readVarFromSite = async (url: string, varName: string) => {
  //to execute puppeteer on serverless env, fallbacks to local exe path while running locally
  const executablePath =
    (await chromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  //launch in headless mode
  const browser = await puppeteer.launch({
    executablePath,
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  //don't need to wait for the whole page to load, only untill var gets available
  page.goto(url).catch(console.error);
  await page.waitForFunction(
    (varName: string) =>
      Object.keys((window as Record<string, any>)[varName] || {}).length > 0,
    {},
    varName
  );

  //extra safety delay to avoid race conditions
  await page.waitForTimeout(100);
  return await page.evaluate(varName);
};

export const getAPIResponder =
  <T>(res: NextApiResponse<APIResponse<T>>, cacheMaxAge = CACHE_MAX_AGE) =>
  (status: number, json: APIResponse<T>) => {
    res
      .setHeader(
        "Cache-Control",
        `max-age=0, s-maxage=${cacheMaxAge}, stale-while-revalidate,`
      )
      .status(status)
      .json(json);
  };
