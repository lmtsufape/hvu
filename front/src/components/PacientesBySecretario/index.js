import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllTutor } from '../../../services/tutorService';
import VoltarButton from '../VoltarButton';

function PacientesBySecretario() {
    const [tutores, setTutores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tutoresData = await getAllTutor();
                setTutores(tutoresData);
            } catch (error) {
                console.error('Erro ao buscar pacientes:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, []);

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    // Função para filtrar os tutores com base no nome do tutor
    const filteredTutores = tutores.filter(tutor => {
        // Verifica se o nome do tutor corresponde ao termo de pesquisa
        return tutor.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de pacientes</h1>
            <div className={styles.navbar}>
                <SearchBar
                    className={styles.pesquisa}
                    placeholder={"Buscar tutor(a)"}
                    onSearchChange={handleSearchChange}
                />
            </div>
            {filteredTutores.length === 0 ? (
                <p className={styles.paragrafo}>Nenhum animal encontrado com o&#40;a&#41; tutor&#40;a&#41; buscado.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredTutores.map(tutor => (
                        <li key={tutor.id} className={styles.info_box}>
                             {console.log('Objeto tutor:', tutor)}
                            <div className={styles.info}>
                                <h6>Responsavel</h6>
                                <p>{tutor.nome}</p>
                            </div>
                            {tutor.animal?.length === 0 ? (
                                <p className={styles.paragrafo}>Não há animais cadastrados para este tutor.</p>
                            ) : (
                                console.log(tutor.animal),
                                tutor.animais?.map(animal => (
                                    <div key={animal.id} className={styles.info_container}>
                                        <div className={styles.info}>
                                            <h6>Paciente</h6>
                                            <p>{animal.nome}</p>
                                        </div>
                                        <div className={styles.info}>
                                            <h6>Espécie</h6>
                                            <p>{animal.raca ? animal.raca.especie.nome : 'Não especificado'}</p>
                                        </div>
                                        <div className={styles.info}>
                                            <h6>Raça</h6>
                                            <p>{animal.raca ? animal.raca.nome : 'Não especificado'}</p>
                                        </div>
                                        <div>
                                            <button
                                                className={styles.acessar_button}
                                                onClick={() => router.push(`/getTutorByIdSecretario/${tutor.id}/${animal.id}`)}
                                            >
                                                Visualizar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PacientesBySecretario;
