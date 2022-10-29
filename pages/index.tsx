import { FormEventHandler, useCallback, useEffect, useState } from "react";
import Button from "../common/components/Button";
import Input from "../common/components/Input";
import { useSelector, useDispatch } from "react-redux";
import { tiktokSelectors } from "../modules/tiktok/redux/selectors";
import { tiktokActions } from "../modules/tiktok/redux/thunks";
import { AppDispatch } from "../store";
import { useRouter } from "next/router";
import { isValidUsername } from "../utils";

export default function Home() {
  const [username, setUsername] = useState("");
  const loading = useSelector(tiktokSelectors.statsLoading);
  const _error = useSelector(tiktokSelectors.statsError);
  const [error, setError] = useState(_error);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(
      tiktokActions.fetchStats({
        username,
        onSuccess: () => router.push(`/stats/${username}`),
      })
    );
  };

  const onValueChange = useCallback((val: string) => {
    setUsername(val);
    setError("");
  }, []);

  useEffect(() => {
    setError(_error);
  }, [_error]);

  useEffect(() => {
    //set button's loading false only after navigation (to accomodate page load delay)
    const handler = () => dispatch(tiktokActions.setStatsLoading(false));
    router.events.on("routeChangeComplete", handler);
    return () => {
      router.events.off("routeChangeComplete", handler);
    };
  }, [router.events]);

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
          onValueChange={onValueChange}
          className="mt-32"
          error={error || ""}
        />

        <Button
          type="submit"
          disabled={!isValidUsername(username) || loading || !!error}
          className="mt-24"
        >
          {loading ? "Fetching Data..." : "Show Performance"}
        </Button>
      </form>
    </div>
  );
}
