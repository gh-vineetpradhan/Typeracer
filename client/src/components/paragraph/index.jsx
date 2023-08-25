import { useEffect, useMemo } from "react";
import styles from "./index.module.css";

export default function Paragraph(props) {
  const charArr = useMemo(() => props.paragraph.split(""), []);

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
        props.indexCursor < charArr.length - 1
      ) {
        console.log("A");
        props.setIndexCursor((prev) => prev + 1);
        if (
          charArr[props.indexCursor + 1] === e.key &&
          props.indexCursor === props.correctCursor
        ) {
          props.setCorrectCursor((prev) => prev + 1);
        }
      }
    };
    document.body.addEventListener("keydown", el);
    return () => {
      document.body.removeEventListener("keydown", el);
    };
  }, [props.indexCursor]);

  return (
    <div className={styles.wrapper}>
      {charArr.map((char, index) => (
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
