import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from './campo_pesquisa.module.css';
import axios from 'axios';

function CampoPesquisa() {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (busca.trim() !== '') {
      setLoading(true);
      axios.get(`http://localhost:8081/api/v1/animal`)
        .then((response) => {
          setResultados(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setResultados([]);
    }
  }, [busca]);

  const handleInputChange = (event) => {
    const termo = event.target.value;
    setBusca(termo);
  };

  return (
    <form className={styles.busca}>
      <input
        type="text"
        className={styles.texto_busca}
        name='animais'
        placeholder="Buscar animal"
        value={busca}
        onChange={handleInputChange}
      />
      <button className={styles.button_busca}>
        <img src='./layouts/icone_busca.svg' alt="Lupa de busca" />
      </button>

      {loading && <p>Carregando...</p>}

      {resultados.length > 0 && !loading && (
        <datalist className={styles.resultados}>
          {resultados.map((animal) => (
            <option key={animal.id} value={animal.nome} />
          ))}
        </datalist>
      )}
    </form>
  );
}

export default CampoPesquisa;
