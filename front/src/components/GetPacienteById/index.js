import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import { getTutorById } from '../../../services/tutorService';
import { getAnimalById } from '../../../services/animalService';
import VoltarButton from '../VoltarButton';

function GetPacienteById() {
    const router = useRouter();
    const { id: tutorId, index: animalId } = router.query;
    const [tutor, setTutor] = useState({});
    const [animal, setAnimal] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (tutorId) {
                    const tutorData = await getTutorById(tutorId);
                    setTutor(tutorData);
                }
            } catch (error) {
                console.error('Erro ao buscar dados do tutor:', error);
            }
        };
        fetchData();
    }, [tutorId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (animalId) {
                    const animalData = await getAnimalById(animalId);
                    setAnimal(animalData);
                }
            } catch (error) {
                console.error('Erro ao buscar dados do animal:', error);
            }
        };
        fetchData();
    }, [animalId]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1); // Adicionando um dia para corrigir a subtração incorreta
        return date.toLocaleDateString('pt-BR', options);
    };

    // Função para formatar o endereço do tutor
    const formatTutorAddress = () => {
        if (tutor.endereco) {
            return `${tutor.endereco.rua}, ${tutor.endereco.numero} - ${tutor.endereco.bairro}`;
        }
        return 'Endereço não definido';
    };

    return (
        <div className={styles.container}>
            <VoltarButton/>
            <h1>Informações do animal</h1>
            <div className={styles.infos_box}>
                {animal && (
                    <ul>
                        <li className={styles.item}>
                            <div className={styles.animal_dados}>
                                <div className={styles.identificacao}>
                                    <div className={styles.nome_animal}>{animal.nome}</div>
                                    <div className={styles.especie_animal}>{animal.raca && animal.raca.especie && animal.raca.especie.nome}</div>
                                </div>
                                <div className={styles.form}>
                                    <div className={styles.box}>
                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Nome do animal</h6>
                                                <p>{animal.nome}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Sexo</h6>
                                                <p>{animal.sexo}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Alergias</h6>
                                                <p>{animal.alergias ? animal.alergias : 'Não definidas'}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Raça</h6>
                                                <p>{animal.raca && animal.raca.nome}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Porte</h6>
                                                <p>{animal.raca && animal.raca.porte ? animal.raca.porte : 'Não definido'}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Número da ficha</h6>
                                                <p>{animal.numeroFicha ? animal.numeroFicha : 'Não definido'}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Data de nascimento</h6>
                                                <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : 'Não definida'}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Peso</h6>
                                                <p>{animal.peso === 0 || animal.peso === '' ? "Não definido" : animal.peso}</p>
                                            </div>
                                        </div>

                                        <div className={styles.button_box}>
                                            <button onClick={() => router.push(`/updateAnimalBySecretarioAndMedico/${animal.id}`)}>
                                                Editar paciente
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                )}

                <ul>
                    {tutor.nome && (
                        <li key={tutor.id} className={styles.item}>
                            <div className={styles.tutor_dados}>
                                <div className={styles.nome_animal}>Informações do&#40;a&#41; tutor&#40;a&#41;</div>
                                <div className={styles.form}>
                                    <div className={styles.box}>
                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Nome</h6>
                                                <p>{tutor.nome}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Telefone</h6>
                                                <p>{tutor.telefone}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>CPF</h6>
                                                <p>{tutor.cpf}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>E-mail</h6>
                                                <p>{tutor.email}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Endereço</h6>
                                                {/* Renderiza o endereço no formato "rua, numero - bairro" */}
                                                <p>{formatTutorAddress()}</p>
                                            </div>
                                        </div>

                                        <div className={styles.button_box}>
                                            <button onClick={() => router.push(`/updateTutorBySecretario/${tutor.id}`)}>
                                                Editar tutor&#40;a&#41;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
                
            </div>
        </div>
    );
}

export default GetPacienteById;
