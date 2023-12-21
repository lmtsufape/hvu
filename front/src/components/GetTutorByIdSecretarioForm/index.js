import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { VoltarWhiteButton } from '../WhiteButton';
import { getTutorById } from '../../../services/tutorService';

function GetTutorByIdForm() {
    const router = useRouter();
    const { id } = router.query;
    const [tutor, setTutor] = useState({});

    useEffect(() => {
        if(id) {
            const fetchData = async () => {
                try {
                    const tutorData = await getTutorById(id);
                    setTutor(tutorData);
                } catch(error) {
                    console.error('Erro ao buscar paciente:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={styles.container}>
            <h1>Perfil do Animal</h1>
            <div className={styles.infos_box}> 
            <ul>
                {tutor.animal && (
                    <li key={tutor.id} className={styles.item}>

                        <div className={styles.animal_dados}>
                            <div className={styles.identificacao}>
                                <div className={styles.nome_animal}>{tutor.animal.nome}</div>
                                <div className={styles.especie_animal}>{tutor.animal.raca} && {tutor.animal.raca.especie} && {tutor.animal.raca.especie.nome}</div>
                            </div>
                            <div className={styles.form}>
                                <div className={styles.box}>
                                    <div className={styles.lista}>
                                        <div className={styles.infos}>
                                            <h6>Nome do animal</h6>
                                            <p>{tutor.animal.nome}</p>
                                        </div>
                                        <div className={styles.infos}>
                                            <h6>Sexo</h6>
                                            <p>{tutor.animal.sexo}</p>
                                        </div>
                                    </div>

                                    <div className={styles.lista}>
                                        <div className={styles.infos}>
                                            <h6>Raça</h6>
                                            <p>{tutor.animal} && {tutor.animal.raca} && {tutor.animal.raca.nome}</p>
                                        </div>
                                        <div className={styles.infos}>
                                            <h6>Porte</h6>
                                            <p>{tutor.animal} && {tutor.animal.raca} && {tutor.animal.raca.porte}</p>
                                        </div>
                                    </div>


                                    <div className={styles.lista}>
                                        <div className={styles.infos}>
                                            <h6>Data de nascimento</h6>
                                            <p>{tutor.animal} && {tutor.animal.dataNascimento}</p>
                                        </div>
                                        <div className={styles.infos}>
                                            <h6>Peso</h6>
                                            <p>{tutor.animal.peso}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                )}
            </ul>

            <ul>
                {tutor && (
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
                                            <p>{tutor.endereço && tutor.endereço.rua}</p>
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
