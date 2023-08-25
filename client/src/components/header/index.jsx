import { Link, useLocation } from "react-router-dom";

import styles from "./index.module.css";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <img src="/logo.svg" alt="" />
        <span>Typeracer</span>
      </div>
      {pathname === "/practice" ||
      pathname === "/global" ||
      pathname === "/friendly" ? (
        <Link to="/" className={styles.leaveBtn}>
          <span className="material-icons-outlined">logout</span>
          <span>Leave</span>
        </Link>
      ) : null}
    </header>
  );
}
