import React, { useMemo, useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from './campo_pesquisa.module.css';
import Image from "next/image";

const animais = [
  'cachorro',
  'gato',
  'cavalo',
  'vaca',
]

function CampoPesquisa() {

  const[busca, setBusca] = useState('');

  const animaisFiltrados = useMemo(() => {
    const lowerBusca = busca.toLowerCase();
    return animais.filter((animal) =>
    animal.toLowerCase().includes(lowerBusca)
    );
  }, [busca, animais]);
    console.log(busca);
    return (
        <form className={styles.busca}>
            <input 
            type="text" 
            className={styles.texto_busca} 
            placeholder="Buscar animal"
            value={busca}
            onChange={(ev) => setBusca(ev.target.value)}
          />
          <button className={styles.button_busca}>
              <img src='./layouts/icone_busca.svg' alt="Lupa de busca"/> 
          </button>

          <ul>
            {animaisFiltrados.map((animais) => (
              <li key={animais}>{animais}</li>
            ))}
          </ul>
        </form>
    );
}

export default CampoPesquisa
