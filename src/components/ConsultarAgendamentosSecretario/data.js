import React, { useState, useEffect } from 'react';
import styles from "./semana.module.css";

function Data() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Atualize a data a cada segundo

    return () => {
      clearInterval(interval);
    };
  }, []);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  return (
    <p className={styles.data}>{formattedDate}</p>
  );
}

export default Data;