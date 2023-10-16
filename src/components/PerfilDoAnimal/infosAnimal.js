import React from 'react';
import styles from "./perfilAnimal.module.css";

function InfosDoAnimal() {
    const [animal, setAnimal] = useState([]);

    useEffect(() => {
        const dataDeTeste = [
            {
                id: 1,
                nome: 'Animal de Teste 1',
                sexo: 'feminino',
                peso: '6kg',
                raca: 'pinsher',
                porte: 'pequeno',
                datanasc: '09/07/2018',
            },
        ];
        setAnimal(dataDeTeste);
    }, []);

    return(
        <container className={styles.container}>
            <h1>Perfil do Animal</h1>
            <div className={styles.infos_box}>
                <div className={styles.identificacao}>

                </div>
                <div className={styles.box}>
                    <ul className={styles.lista}>
                        <li className={styles.infos}>
                            <h6>Nome</h6>
                            <p></p>
                        </li>
                        <li className={styles.infos}>
                            <h6>Sexo</h6>
                            <p></p>
                        </li>
                        <li className={styles.infos}>
                            <h6>Peso</h6>
                            <p></p>
                        </li>
                    </ul>
                    <ul className={styles.lista}>
                        <li className={styles.infos}>
                            <h6>Raça</h6>
                            <p></p>
                        </li>
                        <li className={styles.infos}>
                            <h6>Porte</h6>
                            <p></p>
                        </li>
                        <li className={styles.infos}>
                            <h6>Data de nascimento</h6>
                            <p></p>
                        </li>
                    </ul>
                    <button className={styles.botao}>

                    </button>
                </div>
            </div>
        </container>
    );
}

export default InfosDoAnimal