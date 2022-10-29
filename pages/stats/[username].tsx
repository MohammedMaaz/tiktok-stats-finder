import React from "react";
import { GetServerSideProps } from "next";
import { StatsResponse } from "../../common/types/api";
import tiktokService from "../../modules/tiktok/services";
import { getSerializedError, isValidUsername } from "../../utils";
import { errors } from "../../common/constants/error";
import StatGridItem from "../../modules/tiktok/components/StatGridItem";
import DisplayError from "../../common/components/DisplayError";
import { useSelector } from "react-redux";
import styles from "./index.module.css";
import { tiktokSelectors } from "../../modules/tiktok/redux/selectors";

interface Props {
  data?: StatsResponse;
  error?: string;
}

function Stats({ error, data }: Props) {
  const stateData = useSelector(tiktokSelectors.statsData);
  data = data || (stateData as StatsResponse);
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

/*
  getInitialProps is used instead of getServerSideProps to enable client side
  navigation as well as leverage server rendering for standalone URL
*/
Stats.getInitialProps = async (context: any) => {
  const split = context.req?.url?.split?.("/") || [];
  const username = split[split.length - 1];

  //validate username received in path
  if (!username || !isValidUsername(username)) return { data: null };

  try {
    const res = await tiktokService.fetchStats(username);
    return { data: res.data.data };
  } catch (error) {
    return { error: getSerializedError(error) };
  }
};

export default Stats;
