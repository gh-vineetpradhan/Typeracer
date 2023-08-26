import React from "react";

import styles from "./index.module.css";

export default function MultiplayerTimer(props) {
  return (
    <div className={`${styles.wrapper} card`}>
      <div
        className={styles.timer}
        style={{
          backgroundColor: props.finished
            ? "rgb(84 255 84)"
            : "rgba(0, 0, 0, 0.11)",
        }}
      >
        {Math.floor(props.time / 60)}:
        {props.time % 60 < 10 ? `0${props.time % 60}` : props.time % 60}
      </div>
      <div className={styles.players}>
        {props.players.map((p, i) => (
          <div className={styles.player} key={i}>
            <span>
              {p.username}
              {props.socketId === p.id ? "(You)" : ""}
            </span>
            <div className={styles.progressBar}>
              <div className={styles.progress}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
