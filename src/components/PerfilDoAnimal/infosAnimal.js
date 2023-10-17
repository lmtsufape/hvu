import { useRouter } from 'next/router';
import styles from "./perfilAnimal.module.css";
import { EditarWhiteButton } from "../WhiteButton/white_button";

// Suponha que você tenha uma lista de animais chamada 'listaAnimais'
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

function InfosDoAnimal() {
    const router = useRouter();
    const { id } = router.query; // Obtém o ID do animal da URL

    // Aqui você deve buscar as informações do animal com base no ID
    const animal = listaAnimais.find(animal => animal.id === parseInt(id));

    // Renderize as informações do animal com base no ID
    return (
        <container className={styles.container}>
            <h1>Perfil do Animal</h1>
            <ul>
                {animal && ( // Certifique-se de que o animal existe antes de renderizar
                    <li key={animal.id} className={styles.infos_box}>
                        <div className={styles.identificacao}>
                            <div className={styles.nome_animal}>{animal.nome}</div>
                            <div className={styles.especie_animal}>{animal.especie}</div>
                        </div>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Nome</h6>
                                        <p>{animal.nome}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Sexo</h6>
                                        <p>{animal.sexo}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Peso</h6>
                                        <p>{animal.peso}</p>
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
                                    <div className={styles.infos}>
                                        <h6>Data de nascimento</h6>
                                        <p>{animal.datanasc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.botao}>
                                <EditarWhiteButton />
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </container>
    );
}

export default InfosDoAnimal;
