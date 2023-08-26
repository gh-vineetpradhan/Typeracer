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
            {props.socketId === p.id ? (
              <>
                <div className={styles.username}>
                  <span>{p.username}</span>
                  <span>(You)</span>
                </div>
                <div
                  className={styles.progressBar}
                  style={{
                    border: `2px solid ${
                      props.finished ? "rgb(84 255 84)" : "black"
                    }`,
                  }}
                >
                  <div
                    className={styles.progress}
                    style={{
                      width: `${(100 * props.correctCursor) / props.total}%`,
                      backgroundColor: props.finished
                        ? "rgb(84 255 84)"
                        : "black",
                    }}
                  ></div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.username}>
                  <span>{p.username}</span>
                </div>
                <div
                  className={styles.progressBar}
                  style={{
                    border: `2px solid ${
                      p.progress === 100 ? "rgb(84 255 84)" : "black"
                    }`,
                  }}
                >
                  <div
                    className={styles.progress}
                    style={{
                      width: `${p.progress}%`,
                      backgroundColor:
                        p.progress === 100 ? "rgb(84 255 84)" : "black",
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
