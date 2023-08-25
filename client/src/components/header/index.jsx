import styles from "./index.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <img src="/logo.svg" alt="" />
        <span>Typeracer</span>
      </div>
    </header>
  );
}
