import React from 'react';
import styles from "./loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loading_spinner}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loading;