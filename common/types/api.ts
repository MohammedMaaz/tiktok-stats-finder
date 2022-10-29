export type User = {
  tikTokId: string;
  username: string;
  displayName: string;
  thumbnail: string;
};

export type Stats = {
  followerCount: number;
  avgViews: number;
  avgComments: number;
  avgLikes: number;
  avgShares: number;
  interactionRate: number;
};

export type StatsResponse = {
  user: User;
  stats: Stats;
};

export type APIError = string | Record<string, any>;

export type APIResponse<T> = {
  error?: APIError;
  data?: T;
};
