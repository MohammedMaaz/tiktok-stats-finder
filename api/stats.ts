import type { NextApiRequest, NextApiResponse } from "next";
import {
  TIKTOK_BASE_URL,
  TIKTOK_DATA_VAR,
  VIDEOS_TO_AGGREGATE_COUNT,
} from "../constants/api";
import meanBy from "lodash.meanby";
import { getAPIResponder, readVarFromSite } from "../utils/server";
import { APIResponse, StatsResponse } from "../common/types/api";
import { errors } from "../constants/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<StatsResponse>>
) {
  const respond = getAPIResponder(res);

  try {
    let { username } = req.query;

    //validations
    if (!username)
      return respond(400, {
        error: errors.INVALID_USERNAME,
      });

    if (Array.isArray(username)) username = username[0];

    //scrape data from TikTok's user page
    const state = await readVarFromSite(
      `${TIKTOK_BASE_URL}/@${username}`,
      TIKTOK_DATA_VAR
    );

    if (!state?.UserModule?.users?.[username])
      return respond(404, { error: errors.NO_ACCOUNT });

    const videos = Object.keys(state?.ItemModule || {})
      .slice(0, VIDEOS_TO_AGGREGATE_COUNT)
      .reduce((acc, curr) => acc.concat(state.ItemModule[curr]), []);

    //aggregate stats
    const avgViews = meanBy(videos, "stats.playCount") || 0;
    const avgComments = meanBy(videos, "stats.commentCount") || 0;
    const avgLikes = meanBy(videos, "stats.diggCount") || 0;
    const avgShares = meanBy(videos, "stats.shareCount") || 0;
    const interactionRate = avgViews
      ? ((avgComments + avgLikes + avgShares) / avgViews) * 100
      : 0;
    const user = state.UserModule.users[username];
    const userStats = state.UserModule.stats?.[username];

    return respond(200, {
      data: {
        user: {
          tikTokId: user.id,
          username,
          displayName: user.nickname,
          thumbnail: user.avatarThumb,
        },
        stats: {
          followerCount: userStats?.followerCount || 0,
          avgViews,
          avgComments,
          avgLikes,
          avgShares,
          interactionRate,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return respond(500, { error: errors.INTERNAL });
  }
}
