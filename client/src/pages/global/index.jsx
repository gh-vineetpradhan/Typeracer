import { useEffect, useState } from "react";
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

  useEffect(() => {
    socket.emit("add-to-global", localStorage.getItem("username"));
    socket.on("added-to-game", ({ players, paragraph }) => {
      setPlayers(players.map((p) => ({ id: p[0], username: p[1] || p[0] })));
      setCharArr(paragraph.split(""));
    });
    socket.on("player-joined", (player) => {
      setPlayers((prev) => [
        ...prev,
        { id: player[0], username: player[1] || player[0] },
      ]);
    });
    return () => {
      socket.removeAllListeners("added-to-game");
      socket.removeAllListeners("player-joined");
    };
  }, []);

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
          {charArr.length ? (
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
        </div>
      </div>
      <div>
        <Timer players={players} time={time} socketId={props.socketId} />
      </div>
    </div>
  );
}
