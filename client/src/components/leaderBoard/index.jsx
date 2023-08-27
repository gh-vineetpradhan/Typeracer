import React, { Fragment } from "react";

import styles from "./index.module.css";

export default function Leaderboard(props) {
  return (
    <div className={`card ${styles.wrapper} `}>
      <div className={styles.header}>Leaderboard</div>
      {props.leaderboard.length ? (
        <div className={styles.table}>
          {props.leaderboard.map((d, i) => (
            <Fragment key={i}>
              {props.socketId === d.id ? (
                <div className={styles.username}>
                  <span>{d.username}</span>
                  <span>(You)</span>
                </div>
              ) : (
                <div className={styles.username}>
                  <span>{d.username}</span>
                </div>
              )}
              <div>{d.time}s</div>
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}
