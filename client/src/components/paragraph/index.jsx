import { useEffect } from "react";
import styles from "./index.module.css";

export default function Paragraph(props) {
  useEffect(() => {
    const el = (e) => {
      if (e.keyCode === 8 && props.indexCursor >= 0) {
        props.setIndexCursor((prev) => prev - 1);
        if (props.correctCursor === props.indexCursor) {
          props.setCorrectCursor((prev) => prev - 1);
        }
      }
      if (
        e.key.charCodeAt() <= 126 &&
        e.key.charCodeAt() >= 32 &&
        e.key.length === 1 &&
        props.indexCursor < props.charArr.length - 1
      ) {
        props.setIndexCursor((prev) => prev + 1);
        if (
          props.charArr[props.indexCursor + 1] === e.key &&
          props.indexCursor === props.correctCursor
        ) {
          props.setCorrectCursor((prev) => prev + 1);
          if (props.correctCursor === props.charArr.length - 2)
            props.setFinished(1);
        }
      } else if (props.textArr?.[props.index] !== e.key) {
        props.setIncorrect((prev) => prev + 1);
      }
    };
    if (!props.finished) document.body.addEventListener("keydown", el);
    return () => {
      document.body.removeEventListener("keydown", el);
    };
  }, [props.indexCursor]);

  return (
    <div className={styles.wrapper}>
      {props.charArr.map((char, index) => (
        <span
          className={`${
            index <= props.correctCursor
              ? styles.correct
              : index <= props.indexCursor
              ? styles.incorrect
              : ""
          } ${styles.character}`}
          key={index}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
