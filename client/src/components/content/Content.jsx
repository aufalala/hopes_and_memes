import styles from "./_Content.module.css"

function Content({ children }) {
  return (
    <div className={styles.MainContent}>
      {children}
    </div>
  );
}

export default Content;
