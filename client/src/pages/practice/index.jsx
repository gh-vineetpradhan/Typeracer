import { useState } from "react";

import Paragraph from "../../components/paragraph";

import styles from "./index.module.css";

export default function Practice() {
  const [indexCursor, setIndexCursor] = useState(-1);
  const [correctCursor, setCorrectCursor] = useState(-1);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className="card">
          <Paragraph
            indexCursor={indexCursor}
            correctCursor={correctCursor}
            setIndexCursor={setIndexCursor}
            setCorrectCursor={setCorrectCursor}
            paragraph="A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs."
          />
        </div>
      </div>
    </div>
  );
}
