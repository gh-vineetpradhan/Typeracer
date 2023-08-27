import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { Link } from "react-router-dom";

import Paragraph from "../../components/paragraph";
import Timer from "../../components/multiplayerTimer";
import Report from "../../components/report";
import Leaderboard from "../../components/leaderBoard";

import styles from "../practice/index.module.css";

export default function Friendly(props) {
  const [indexCursor, setIndexCursor] = useState(-1);
  const [correctCursor, setCorrectCursor] = useState(-1);
  const [time, setTime] = useState(0); /* in seconds */
  const [incorrect, setIncorrect] = useState(0);
  const [finished, setFinished] = useState(0);
  const [charArr, setCharArr] = useState([]);
  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  //status: 0 = initial, 1 = countdown started, 2 = race started, 3 = housefull
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (finished) {
      socket.emit("finished", {
        roomId,
        time,
      });
      clearInterval(intervalRef.current);
      setLeaderboard((prev) => [
        ...prev,
        {
          id: props.socketId,
          time,
          username: localStorage.getItem("username") || props.socketId,
        },
      ]);
    } else {
      if (charArr?.length) {
        socket.emit("set-progress", {
          progress: (100 * correctCursor) / charArr.length,
          roomId,
        });
      }
    }
  }, [correctCursor, finished]);
  useEffect(() => {
    socket.emit("create-friendly", localStorage.getItem("username"));
    socket.on("friendly-created", ({ roomId, paragraph }) => {
      setRoomId(roomId);
      setCharArr(paragraph.split(""));
    });
    socket.on("player-joined", (player) => {
      setPlayers((prev) => [
        ...prev,
        { id: player[0], username: player[1] || player[0], progress: 0 },
      ]);
    });
    socket.on("set-progress", (obj) => {
      setPlayers((prev) =>
        prev.map((p) =>
          obj.player === p.id ? { ...p, progress: obj.progress } : p
        )
      );
    });
    socket.on("finished", ({ id, time, username }) => {
      setPlayers((prev) =>
        prev.map((p) => (id === p.id ? { ...p, progress: 100 } : p))
      );
      setLeaderboard((prev) =>
        [...prev, { time, id, username: username }].sort(
          (a, b) => a.time - b.time
        )
      );
    });
    socket.on("friendly-start-countdown", () => {
      setCountdown(10);
      intervalRef.current = setInterval(
        () => setCountdown((prev) => prev - 1),
        1000
      );
      setStatus(1);
    });
    socket.on("player-left", (id) => {
      setPlayers((prev) => prev.filter((x) => x.id !== id));
    });
    return () => {
      socket.emit("leave-room");
      socket.removeAllListeners("friendly-created");
      socket.removeAllListeners("player-joined");
      socket.removeAllListeners("set-progress");
      socket.removeAllListeners("finished");
      socket.removeAllListeners("friendly-start-countdown");
      socket.removeAllListeners("player-left");
    };
  }, []);
  useEffect(() => {
    if (countdown === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      setStatus(2);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  }, [countdown]);
  useEffect(() => {
    setPlayers([
      {
        id: props.socketId,
        progress: 0,
        username: localStorage.getItem("username") || props.socketId,
      },
    ]);
  }, [props.socketId]);

  return (
    <div className={styles.wrapper}>
      <div>
        <Report
          finished={finished}
          textLength={charArr.length}
          time={time}
          incorrect={incorrect}
        />
        <Leaderboard
          leaderboard={leaderboard}
          socketId={props.socketId}
          startingTime={roomId.split("-")[1]}
        />
      </div>
      <div>
        <div className={`card ${styles.paragraphCard}`}>
          {charArr.length && status === 2 ? (
            <>
              <Paragraph
                indexCursor={indexCursor}
                correctCursor={correctCursor}
                setIndexCursor={setIndexCursor}
                setCorrectCursor={setCorrectCursor}
                charArr={charArr}
                finished={finished}
                setFinished={setFinished}
                setIncorrect={setIncorrect}
              />
            </>
          ) : null}
          <span className={styles.paragraphCardFooter}>
            {status === 0 ? (
              <button
                className={styles.restartBtn}
                onClick={() => socket.emit("friendly-start-countdown", roomId)}
              >
                Start Race
              </button>
            ) : null}
            {status === 1 ? (
              <>
                Race starts in : 00:
                {countdown < 10 ? `0${countdown % 60}` : countdown}
              </>
            ) : null}
            {status === 2 ? <>Race Started</> : null}
          </span>
        </div>
        {status === 0 ? (
          <div className={styles.url}>
            Share this url to invite :{" "}
            <Link>
              {location.href}/{roomId}
            </Link>
          </div>
        ) : null}
      </div>
      <div>
        <Timer
          players={players}
          time={time}
          socketId={props.socketId}
          finished={finished}
          correctCursor={correctCursor + 1}
          total={charArr.length}
        />
      </div>
    </div>
  );
}
