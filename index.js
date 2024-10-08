import { displayLaps } from "./display-laps.js";
import { findSlowestAndFastest, findHourMinuteSeconds } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  let laps = [];

  let isTimeRunning = false;
  let totalMilliseconds = 0;
  let timerID;

  let lastLapTime = 0;
  let lapTimerId;

  let fastestLapTimeIndex;
  let slowestLapTimeIndex;

  const rightSideButton = document.getElementById("right-side-button");
  const leftSideButton = document.getElementById("left-side-button");

  rightSideButton.addEventListener("click", function () {
    if (!isTimeRunning) {
      // -------------->   Functionality for START button   <-----------------
      isTimeRunning = true;

      rightSideButton.innerText = "Stop";
      rightSideButton.style.backgroundColor = "red";
      rightSideButton.style.color = "white";

      leftSideButton.innerText = "Lap";

      if (laps.length === 0) {
        startLap();
      }

      timerID = setInterval(function () {
        totalMilliseconds++;

        const formattedTimeData = findHourMinuteSeconds(totalMilliseconds);

        document.getElementById("minutes").innerText =
          formattedTimeData.minutes;
        document.getElementById("seconds").innerText =
          formattedTimeData.seconds;
        document.getElementById("milliseconds").innerText =
          formattedTimeData.milliseconds;
      }, 10);
    } else {
      // -------------->   Functionality for STOP button   <-----------------
      isTimeRunning = false;

      rightSideButton.innerText = "Start";
      rightSideButton.style.backgroundColor = "green";
      rightSideButton.style.color = "#fafafa";

      leftSideButton.innerText = "Reset";

      clearInterval(timerID);
    }
  });

  leftSideButton.addEventListener("click", function () {
    if (!isTimeRunning) {
      // -------------->   Functionality for RESET button   <-----------------
      isTimeRunning = false;
      laps = [];
      totalMilliseconds = 0;
      lastLapTime = 0;
      fastestLapTimeIndex = undefined;
      slowestLapTimeIndex = undefined;

      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      document.getElementById("milliseconds").innerText = "00";

      clearInterval(timerID);
      clearInterval(lapTimerId);
      displayLaps(laps, fastestLapTimeIndex, slowestLapTimeIndex);
    } else {
      // -------------->   Functionality for LAP button   <-----------------
      clearInterval(lapTimerId);
      startLap();
    }
  });

  function startLap() {
    if (laps.length > 1) {
      const fastSlowData = findSlowestAndFastest(laps);

      fastestLapTimeIndex = fastSlowData[0];
      slowestLapTimeIndex = fastSlowData[1];
    }

    lastLapTime = totalMilliseconds;

    laps.push({
      lap: laps.length + 1,
      lapTimeInMilliseconds: 0,
      minutes: "00",
      seconds: "00",
      milliseconds: "00",
    });

    lapTimerId = setInterval(function () {
      const lapTime = totalMilliseconds - lastLapTime;
      const formattedTimeData = findHourMinuteSeconds(lapTime);

      laps[laps.length - 1] = {
        lap: laps.length,
        lapTimeInMilliseconds: lapTime,
        minutes: formattedTimeData.minutes,
        seconds: formattedTimeData.seconds,
        milliseconds: formattedTimeData.milliseconds,
      };

      displayLaps(laps, fastestLapTimeIndex, slowestLapTimeIndex);
    });
  }
});
