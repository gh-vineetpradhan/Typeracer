import { useEffect, useState } from "react";
import socket from "../../socket";

import Paragraph from "../../components/paragraph";
import Timer from "../../components/singleplayerTimer";
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
    if (!charArr.length) {
      socket.emit("generate-paragraph");
    }
  }, [charArr.length]);
  useEffect(() => {
    socket.on("paragraph-generated", (paragraph) => {
      setCharArr(paragraph.split(""));
    });
    return () => {
      socket.removeAllListeners("paragraph-generated");
    };
  }, []);

  const resetParagraphHandler = () => {
    setIndexCursor(-1);
    setCorrectCursor(-1);
    setTime(0);
    setIncorrect(0);
    setFinished(0);
    setCharArr([]);
  };

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
              <div className={styles.paragraphCardFooter}>
                <button
                  className={styles.restartBtn}
                  onClick={() => resetParagraphHandler()}
                >
                  Reset
                </button>
              </div>
            </>
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
