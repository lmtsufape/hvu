import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import { getTutorById } from '../../../services/tutorService';
import { getAnimalById } from '../../../services/animalService';
import VoltarButton from '../VoltarButton';

function GetTutorByIdForm() {
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

    // Função para formatar a data de nascimento do animal
    const formatAnimalDateOfBirth = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className={styles.container}>
            <VoltarButton/>
            <h1>Perfil do Paciente</h1>
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
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Raça</h6>
                                                <p>{animal.raca && animal.raca.nome}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Porte</h6>
                                                <p>{animal.raca && animal.raca.porte}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Data de nascimento</h6>
                                                <p>{formatAnimalDateOfBirth(animal.dataNascimento)}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Peso</h6>
                                                <p>{animal.peso}</p>
                                            </div>
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
                                <div className={styles.nome_animal}>Informações do tutor</div>
                                <div className={styles.form}>
                                    <div className={styles.box}>
                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Nome do tutor</h6>
                                                <p>{tutor.nome}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Telefone</h6>
                                                <p>{tutor.telefone}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>RG</h6>
                                                <p>{tutor.rg}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Endereço</h6>
                                                <p>{tutor.endereco && tutor.endereco.rua}</p>
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

export default GetTutorByIdForm;
