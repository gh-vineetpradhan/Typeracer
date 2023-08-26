import { useEffect, useRef, useState } from "react";
import socket from "../../socket";

import Paragraph from "../../components/paragraph";
import Timer from "../../components/multiplayerTimer";
import Report from "../../components/report";

import styles from "../practice/index.module.css";

export default function Global(props) {
  const [indexCursor, setIndexCursor] = useState(-1);
  const [correctCursor, setCorrectCursor] = useState(-1);
  const [time, setTime] = useState(0); /* in seconds */
  const [incorrect, setIncorrect] = useState(0);
  const [finished, setFinished] = useState(0);
  const [charArr, setCharArr] = useState([]);
  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (finished) {
      clearInterval(intervalRef.current);
    }
  }, [finished]);
  useEffect(() => {
    socket.emit("add-to-global", localStorage.getItem("username"));
    socket.on("added-to-game", ({ players, paragraph, roomId }) => {
      setPlayers(players.map((p) => ({ id: p[0], username: p[1] || p[0] })));
      setCharArr(paragraph.split(""));
      setCountdown(60 - Math.floor((new Date().getTime() - roomId) / 1000));
      intervalRef.current = setInterval(
        () => setCountdown((prev) => prev - 1),
        1000
      );
    });
    socket.on("player-joined", (player) => {
      setPlayers((prev) => [
        ...prev,
        { id: player[0], username: player[1] || player[0] },
      ]);
    });
    socket.on("player-left", (id) => {
      setPlayers((prev) => prev.filter((x) => x.id !== id));
    });
    return () => {
      socket.emit("leave-room");
      socket.removeAllListeners("added-to-game");
      socket.removeAllListeners("player-joined");
      socket.removeAllListeners("player-left");
    };
  }, []);
  useEffect(() => {
    if (countdown === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  }, [countdown]);

  return (
    <div className={styles.wrapper}>
      <div>
        <Report
          finished={finished}
          textLength={charArr.length}
          time={time}
          incorrect={incorrect}
        />
      </div>
      <div>
        <div className={`card ${styles.paragraphCard}`}>
          {charArr.length && !countdown ? (
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
          {countdown ? (
            <span className={styles.paragraphCardFooter}>
              Race starts in : 00:
              {countdown < 10 ? `0${countdown % 60}` : countdown}
            </span>
          ) : (
            <span className={styles.paragraphCardFooter}>Race Started</span>
          )}
        </div>
      </div>
      <div>
        <Timer
          players={players}
          time={time}
          socketId={props.socketId}
          finished={finished}
        />
      </div>
    </div>
  );
}
