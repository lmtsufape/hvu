import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from './index.module.css';
import { getAllAnimal } from '../../../services/animalService';

function CampoPesquisa() {
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        setLoading(true);
        const animais = await getAllAnimal();
        setResultados(animais);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimais();
  }, []); // Este useEffect é executado apenas uma vez, quando o componente é montado

  const handleInputChange = (e) => {
    setBusca(e.target.value);
  };

  const handleSearch = () => {
    // Lógica para filtrar os resultados com base na busca
    const resultadosFiltrados = resultados.filter(animal => animal.nome.toLowerCase().includes(busca.toLowerCase()));
    // Implemente a lógica necessária para tratar os resultados filtrados
    console.log(resultadosFiltrados);
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
      <button className={styles.button_busca} type="button" onClick={handleSearch}>
        <img src='./images/icone_busca.svg' alt="Lupa de busca" />
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
