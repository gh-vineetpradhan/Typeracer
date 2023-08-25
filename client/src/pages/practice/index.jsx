import { useMemo, useState } from "react";

import Paragraph from "../../components/paragraph";

import styles from "./index.module.css";
import Timer from "../../components/timer";

export default function Practice() {
  const [indexCursor, setIndexCursor] = useState(-1);
  const [correctCursor, setCorrectCursor] = useState(-1);
  const [time, setTime] = useState(0); /* in seconds */
  const [finished, setFinished] = useState(0);
  const charArr = useMemo(
    () =>
      "A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.".split(
        ""
      ),
    []
  );

  return (
    <div className={styles.wrapper}>
      <div>
        <div className="card">
          <Paragraph
            indexCursor={indexCursor}
            correctCursor={correctCursor}
            setIndexCursor={setIndexCursor}
            setCorrectCursor={setCorrectCursor}
            charArr={charArr}
            finished={finished}
            setFinished={setFinished}
          />
        </div>
      </div>
      <div>
        <div className="card">
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
    </div>
  );
}
