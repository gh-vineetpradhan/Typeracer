import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState(
    localStorage.getItem("typeracer-username") || ""
  );
  const [_bool, setBool] = React.useState(0); //Only to force rerender on saving username

  return (
    <main className={styles.wrapper}>
      <div className={`${styles.card} card`}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={40}
        />
        <button
          className={`${
            username === localStorage.getItem("typeracer-username")
              ? "disabled-btn"
              : ""
          }`}
          onClick={() => {
            if (username !== localStorage.getItem("typeracer-username")) {
              localStorage.setItem("typeracer-username", username);
              setBool((prev) => !prev);
            }
          }}
        >
          Save
        </button>
      </div>
      <div className={`${styles.card} card`}>
        <div className={styles.cardHeader}>Play Globally</div>
        <div className={styles.cardDescription}>
          Improve your typing speed by racing against people around the world.
        </div>
        <button onClick={() => navigate("/global")}>Start Matchmaking</button>
      </div>
      <div className={`${styles.card} card`}>
        <div className={styles.cardHeader}>Typing Test</div>
        <div className={styles.cardDescription}>Improve your typing skills</div>
        <button onClick={() => navigate("/practice")}>Practice Yourself</button>
      </div>
      <div className={`${styles.card} card`}>
        <div className={styles.cardHeader}>Race your friends</div>
        <div className={styles.cardDescription}>
          Create your own racetrack and play with friends
        </div>
        <button onClick={() => navigate("/friendly")}>Create Racetrack</button>
      </div>
    </main>
  );
}
