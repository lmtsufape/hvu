import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListaTeste() {
  
  const instance = axios.create({
    baseURL: 'http://localhost:8081/api/v1',
  });

  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/animal');
        setAnimais(response.data);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
      }
    };

    fetchData();
  }, []);

  console.log(animais);

  return (
    <div>
      <h1>Lista de animais</h1>
      <ul>
        {animais.map((animal) => (
          <li key={animal.id}>{animal.nome}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTeste;
