import { useRouter } from 'next/router';
import styles from "./perfilAnimal.module.css";

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

function InfosDoAnimal() {
    const router = useRouter();
    const { id } = router.query; // Obtém o ID do animal da URL

    // Aqui você deve buscar as informações do animal com base no ID
    const animal = listaAnimais.find(animal => animal.id === parseInt(id));

    const handleEditarClick = (animalId) => {
        router.push(`/editarperfilanimal/${animalId}`);
    };

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
                                <button className={styles.editar_button} onClick={() => handleEditarClick(animal.id)}>Editar</button>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </container>
    );
}

export default InfosDoAnimal;


// Para quando for fazer a chamada da api
// function InfosDoAnimal() {
//     const router = useRouter();
//     const { id } = router.query; // Obtém o ID do animal da URL
//     const [animal, setAnimal] = useState(null);

//     useEffect(() => {
//         // Verifica se o ID é válido
//         if (id) {
//             // Faça uma chamada à sua API para buscar os dados do animal com base no ID
//             axios.get(`/sua-api/animais/${id}`)
//                 .then((response) => {
//                     setAnimal(response.data); // Atualiza o estado com os dados do animal
//                 })
//                 .catch((error) => {
//                     console.error('Erro ao buscar os dados do animal:', error);
//                 });
//         }
//     }, [id]);

//     return (
//         <div className={styles.container}>
//             <h1>Perfil do Animal</h1>
//             <ul>
//                 {animal && ( // Certifique-se de que o animal existe antes de renderizar
//                     <li key={animal.id} className={styles.infos_box}>
//                         {/* Resto do seu componente permanece inalterado */}
//                     </li>
//                 )}
//             </ul>
//         </div>
//     );
// }

// export default InfosDoAnimal;

