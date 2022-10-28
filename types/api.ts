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

export type APIResponse<T> = {
  error?: string | Record<string, any>;
  data?: T;
};
