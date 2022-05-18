import { Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CountdownTimer = ({ endsIn }: { endsIn: number }) => {
  const router = useRouter();
  const [time, setTime] = useState(
    DateTime.fromMillis(endsIn).diff(DateTime.local())
  );

  useEffect(() => {
    let timer: NodeJS.Timer;
    timer = setInterval(() => {
      setTime((prevtime) => prevtime.minus({ seconds: 1 }));
    }, 1000);

    if (time.toFormat("mm:ss") === "00:00" && timer) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (time.toFormat("mm:ss") === "00:00") {
      router.replace("/reveal");
    }
  }, [time, endsIn, router]);

  return (
    <>
      <Typography
        sx={{
          color: Math.floor(time.as("minutes")) === 0 ? "red" : "inherit",
        }}
      >
        {DateTime.local().toMillis() < endsIn ? (
          time.toFormat("mm:ss")
        ) : (
          <Typography>Expired!</Typography>
        )}
      </Typography>
    </>
  );
};

export default CountdownTimer;
