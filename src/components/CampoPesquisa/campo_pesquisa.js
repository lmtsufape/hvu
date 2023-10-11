import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from './campo_pesquisa.module.css';
import Image from "next/image";

function CampoPesquisa() {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };
    
    const handleSearch = () => {
        axios.get(`sua_url_da_api/pessoas?nome=${searchText}`) 
        .then((response) => {
          // Atualizar o estado com os resultados da pesquisa
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error('Erro ao buscar pessoas:', error);
        });
    };

    return (
        <form className={styles.busca}>
            <input 
            type="search" 
            className={styles.texto_busca} 
            placeholder="Buscar animal"
            value={searchText}
            onChange={handleInputChange}
        />

            <button className={styles.button_busca} onClick={handleSearch}>
                <img src='./layouts/icone_busca.svg' alt="Lupa de busca"/> 
            </button>

        {/* Renderize os resultados da pesquisa aqui */}
        <ul>
        {searchResults.map((animal) => (
          <li key={animal.id}>{animal.nome}</li>
        ))}
      </ul>
        </form>
    );
}

export default CampoPesquisa
