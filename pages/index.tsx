import { FormEventHandler, useState } from "react";
import Button from "../common/components/Button";
import Input from "../common/components/Input";
import { useSelector, useDispatch } from "react-redux";
import { tiktokSelectors } from "../modules/tiktok/redux/selectors";
import { tiktokActions } from "../modules/tiktok/redux/thunks";
import { AppDispatch } from "../store";

export default function Home() {
  const [username, setUsername] = useState("");
  const loading = useSelector(tiktokSelectors.statsLoading);
  const error = useSelector(tiktokSelectors.statsError);
  const data = useSelector(tiktokSelectors.statsData);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(tiktokActions.fetchStats(username));
  };

  return (
    <div className="flex flex-col items-center max-w-xl m-auto">
      <h1 className="text-display5 md:text-display3 text-dark font-semibold mt-6 md:mt-48">
        TikTok Metrics
      </h1>

      <p className="text-title text-medium text-center mt-24">
        Find out how the Creator’s last 10 videos performed.
      </p>

      <form className="w-full flex flex-col" onSubmit={onSubmit}>
        <Input
          inputProps={{
            name: "username",
          }}
          prefix="tiktok.com/@"
          hint="username"
          value={username}
          onValueChange={setUsername}
          className="mt-32"
          error={error || ""}
        />

        <Button type="submit" disabled={!username || loading} className="mt-24">
          {loading ? "Fetching Data..." : "Show Performance"}
        </Button>
      </form>
    </div>
  );
}
