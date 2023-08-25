import styles from "./index.module.css";

export default function Report(props) {
  return (
    <div
      className={`${styles.details} card ${
        props.finished ? styles.showDetails : ""
      }`}
    >
      <header>Details</header>
      <div className={props.finished ? styles.showDetailsDiv : ""}>
        letters/minutes: {((props.textLength / props.time) * 60).toFixed(2)}
        <br /> accuracy:{" "}
        {(
          (props.textLength / (props.incorrect + props.textLength)) *
          100
        ).toFixed(2)}
        %
        <br /> characters: {props.textLength}
        <br /> mistakes: {props.incorrect}
      </div>
    </div>
  );
}
