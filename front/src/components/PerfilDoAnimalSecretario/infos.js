import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./infos.module.css";
import { EditarWhiteButton } from "../WhiteButton";
import axios from 'axios';

//json para teste
const listaAnimais = [
    {
        id: 1,
        nome: 'Animal 1',
        especie: 'Cachorro',
        sexo: 'Macho',
        peso: '10 kg',
        raca: 'Vira-lata',
        porte: 'Médio',
        datanasc: '01/01/2018',
    },
    {
        id: 2,
        nome: 'Animal 2',
        especie: 'Gato',
        sexo: 'Fêmea',
        peso: '5 kg',
        raca: 'Siamês',
        porte: 'Pequeno',
        datanasc: '15/03/2019',
    },
];

const listaTutores = [
    {
        id: 1,
        nome: 'Tutor 1',
        telefone: '1',
        cpf: '1',
        email: '1@.com',
        rg: '1',
        endereço: 'centro',
    },
    {
        id: 2,
        nome: 'Tutor 2',
        telefone: '2',
        cpf: '2',
        email: '2@.com',
        rg: '2',
        endereço: 'boa vista',
    },
];

function InfosDoAnimalETutor() {
    const router = useRouter();
    const { id } = router.query; // Obtém o ID do animal da URL

    // Aqui você deve buscar as informações do animal com base no ID
    const animal = listaAnimais.find(animal => animal.id === parseInt(id));
    const tutor = listaTutores.find(tutor => tutor.id === parseInt(id));

    // Renderize as informações do animal com base no ID
    return (
        <container className={styles.container}>
            <h1>Perfil do Animal</h1>
            <div className={styles.infos_box}> 
            <ul>
                {animal && ( // Certifique-se de que o animal existe antes de renderizar
                    <li key={animal.id} className={styles.item}>

                        <div className={styles.animal_dados}>
                            <div className={styles.identificacao}>
                                <div className={styles.nome_animal}>{animal.nome}</div>
                                <div className={styles.especie_animal}>{animal.especie}</div>
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
                                            <p>{animal.raca}</p>
                                        </div>
                                        <div className={styles.infos}>
                                            <h6>Porte</h6>
                                            <p>{animal.porte}</p>
                                        </div>
                                    </div>


                                    <div className={styles.lista}>
                                        <div className={styles.infos}>
                                            <h6>Data de nascimento</h6>
                                            <p>{animal.datanasc}</p>
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
                )}
            </ul>

            <ul>
                {tutor && ( // Certifique-se de que o animal existe antes de renderizar
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
                                            <p>{tutor.endereço}</p>
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
        </container>
    );
}

export default InfosDoAnimalETutor;


// Para quando for fazer a chamada da api

// function InfosDoAnimalETutor() {
//     const router = useRouter();
//     const { id } = router.query; // Obtém o ID do animal da URL
//     const [animal, setAnimal] = useState(null);
//     const [tutor, setTutor] = useState(null);

//     useEffect(() => {
//         if (id) {
//             // Fazer uma solicitação à sua API para buscar os dados do animal e do tutor
//             axios.get(`/sua_api/animais/${id}`)
//                 .then(response => {
//                     setAnimal(response.data); // Define os dados do animal no estado
//                 })
//                 .catch(error => {
//                     console.error('Erro ao buscar informações do animal', error);
//                 });

//             axios.get(`/sua_api/tutores/${id}`)
//                 .then(response => {
//                     setTutor(response.data); // Define os dados do tutor no estado
//                 })
//                 .catch(error => {
//                     console.error('Erro ao buscar informações do tutor', error);
//                 });
//         }
//     }, [id]);

//     return (
//         <container className={styles.container}>
//             <h1>Perfil do Animal</h1>
//             <div className={styles.infos_box}>
//                 {animal && (
//                     // Renderize as informações do animal
//                     // ...
//                 )}
//                 {tutor && (
//                     // Renderize as informações do tutor
//                     // ...
//                 )}
//             </div>
//         </container>
//     );
// }

// export default InfosDoAnimalETutor;

