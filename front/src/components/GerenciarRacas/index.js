import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllRaca, deleteRaca } from '../../../services/racaService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import FilterEspecieRaca from '../FilterEspecieRaca';

function GerenciarRacasList() {
    const [racas, setRacas] = useState([]);
    const [filtro, setFiltro] = useState('especie');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const racasData = await getAllRaca();
                setRacas(racasData);
            } catch (error) {
                console.error('Erro ao buscar racas:', error);
            }
        };
        fetchData();
    }, []);

    const handleDeleteRaca = async (racaId) => {
        try {
            await deleteRaca(racaId);
            setRacas(racas.filter(raca => raca.id !== racaId));
            window.location.reload();
            alert("Raça excluída com sucesso!");
        } catch (error) {
            console.error('Erro ao excluir a raça:', error);
            if (error.response && error.response.status === 409) {
                alert("Esta raça não pode ser excluída por estar associada a um animal.");
            }
        }
    };

    const handleFilterChange = (event) => {
        setFiltro(event.target.value);
    };

    // Função para filtrar as raças com base na opção selecionada
    const filteredRacas = racas.filter(raca => {
        if (filtro === 'especie') {
            return raca.especie && raca.especie.nome.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filtro === 'raca') {
            return raca.nome.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de raças</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por ${filtro === 'especie' ? 'Espécie' : 'Raça'}`} onSearchChange={setSearchTerm} />
                <FilterEspecieRaca onChange={handleFilterChange} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/createRaca`)}>
                    Adicionar raça
                </button>
            </div>

            {filteredRacas.length === 0 ? (
                <p className={styles.paragrafo}>Item pesquisado não existe no sistema.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredRacas.map(raca => (
                        <li key={raca.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Espécie</h6>
                                <p>{raca.especie && raca.especie.nome}</p>
                            </div>
                            <div className={styles.info_box}>
                                <h6>Raça</h6>
                                <p>{raca.nome}</p>
                            </div>
                            <div  className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/updateRaca/${raca.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={raca.id} onDelete={handleDeleteRaca} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GerenciarRacasList;
