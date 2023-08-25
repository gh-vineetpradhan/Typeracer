import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.css";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>404</div>
      <button
        className={`${styles.navigateBtn} link-btn`}
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
}
