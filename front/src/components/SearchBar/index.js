import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from './index.module.css';

function SearchBar() {

  return (
    <div className={styles.busca}>
      <input
        type="text"
        className={styles.texto_busca}
        name='animais'
        placeholder="Buscar animal"
      />

      <button className={styles.button_busca} type="button">
        <img src='./images/icone_busca.svg' alt="Lupa de busca" />
      </button>
    </div>
  );
}

export default SearchBar;
