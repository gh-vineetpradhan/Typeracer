import { useEffect, useState } from "react";
import socket from "../../socket";

import Paragraph from "../../components/paragraph";
import Timer from "../../components/timer";
import Report from "../../components/report";

import styles from "./index.module.css";

export default function Practice() {
  const [indexCursor, setIndexCursor] = useState(-1);
  const [correctCursor, setCorrectCursor] = useState(-1);
  const [time, setTime] = useState(0); /* in seconds */
  const [incorrect, setIncorrect] = useState(0);
  const [finished, setFinished] = useState(0);
  const [charArr, setCharArr] = useState([]);

  useEffect(() => {
    socket.emit("generate-paragraph");
  }, []);
  useEffect(() => {
    socket.on("paragraph-generated", (paragraph) => {
      setCharArr(paragraph.split(""));
    });
    return () => {
      socket.removeAllListeners("paragraph-generated");
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
        <div className="card">
          {charArr.length ? (
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
          ) : null}
        </div>
      </div>
      <div>
        <Timer
          correctCursor={correctCursor}
          indexCursor={indexCursor}
          total={charArr.length}
          time={time}
          setTime={setTime}
          finished={finished}
        />
      </div>
    </div>
  );
}
