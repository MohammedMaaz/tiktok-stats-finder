import React from "react";
import { GetServerSideProps } from "next";
import { StatsResponse } from "../../common/types/api";
import tiktokService from "../../modules/tiktok/services";
import { getSerializedError } from "../../utils";
import { errors } from "../../constants/error";
import StatGridItem from "../../modules/tiktok/components/StatGridItem";
import styles from "./index.module.css";
import DisplayError from "../../common/components/DisplayError";

interface Props {
  data?: StatsResponse;
  error?: string;
}

export default function Stats({ error, data }: Props) {
  if (error || !data) return <DisplayError message={error || errors.NO_DATA} />;

  const { user, stats } = data;

  return (
    <div className="flex flex-col max-w-xl m-auto text-dark font-semibold">
      <h4 className="text-subheader text-medium">Showing data for</h4>
      <h2 className="text-heading2">{`tiktok.com/@${user.username}`}</h2>

      <div className="mt-12 rounded-full p-8 pr-12 border border-outline-light flex items-center w-fit">
        <img
          className="rounded-full object-cover"
          width={24}
          height={24}
          alt="thumbnail"
          src={user.thumbnail}
        />
        <p className="ml-8 text-subheader">{user.displayName}</p>
      </div>

      <div className={`${styles.grid} mt-48`}>
        <StatGridItem heading="Total Followers" value={stats.followerCount} />
        <StatGridItem heading="Average Video Views" value={stats.avgViews} />
        <StatGridItem
          heading="Interaction-rate"
          value={stats.interactionRate}
          format="percentage"
        />
        <StatGridItem heading="Average Comments" value={stats.avgComments} />
        <StatGridItem heading="Average Likes" value={stats.avgLikes} />
        <StatGridItem heading="Average Shares" value={stats.avgShares} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let username = context.params?.username;
  if (Array.isArray(username)) username = username[0];

  if (!username) return { props: { error: errors.INVALID_USERNAME } };

  try {
    const res = await tiktokService.fetchStats(username);
    return { props: { data: res.data.data } };
  } catch (error) {
    return { props: { error: getSerializedError(error) } };
  }
};
