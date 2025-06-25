import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

function FichaDermatologicaStep1({ formData, handleChange, nextStep, handleCheckboxChange, setFormData, handleCheckboxChangeOutros,
    showOtherInputConviveComAnimais,
    setShowOtherInputConviveComAnimais,
    otherValueConviveComAnimais,
    setOtherValueConviveComAnimais,
    showOtherInputProdutosUtilizados,
    setShowOtherInputProdutosUtilizados,
    otherValueProdutosUtilizados,
    setOtherValueProdutosUtilizados,
    cleanLocalStorage }) {


    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor, setTutor] = useState({});
    const [consultaId, setConsultaId] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            const id = router.query.fichaId;
            const animalId = router.query.animalId;
            if (id) {
                setConsultaId(id);
            }
            if (animalId) {
                setAnimalId(animalId);
            }
        }
    }, [router.isReady, router.query.fichaId]);

    useEffect(() => {
        if (!animalId) return;

        const fetchData = async () => {
            try {
                const animalData = await getAnimalById(animalId);
                setAnimal(animalData);
            } catch (error) {
                console.error('Erro ao buscar animal:', error);
            }

            try {
                const tutorData = await getTutorByAnimal(animalId);
                setTutor(tutorData);
            } catch (error) {
                console.error('Erro ao buscar tutor do animal:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [animalId]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };



    const handleTratamentoChange = (e) => {
        const { name, value } = e.target;

        if (name === "tratamentosAtuais.confirmacao") {
            setFormData(prev => ({
                ...prev,
                tratamentosAtuais: {
                    ...prev.tratamentosAtuais,
                    confirmacao: value,
                    // Limpa os outros campos se for "Não"
                    ...(value === "Não" ? {
                        tipoTratamento: "",
                        responsividade: ""
                    } : {})
                }
            }));
        } else {
            handleChange(e);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        nextStep();
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha Dermatológica</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    <div className={styles.box_ficha_toggle}>
                        <button
                            type="button"
                            className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
                            onClick={() => setShowButtons(prev => !prev)}
                        >
                            Dados do animal
                        </button>
                        {showButtons && (
                            <div className={styles.container_toggle}>
                                <ul>
                                    {animal && (
                                        <li key={animal.id} className={styles.infos_box}>
                                            <div className={styles.identificacao}>
                                                <div className={styles.nome_animal}>{animal.nome}</div>
                                                <div className={styles.especie_animal}>Nome</div>
                                            </div>
                                            <div className={styles.form}>
                                                <div className={styles["animal-data-box"]}>
                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Espécie</h6>
                                                            <p>{animal.raca && animal.raca.especie && animal.raca.especie.nome}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Sexo</h6>
                                                            <p>{animal.sexo}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Peso</h6>
                                                            <p>{animal.peso === 0 || animal.peso === '' ? 'Não definido' : animal.peso}</p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Raça</h6>
                                                            <p>{animal.raca && animal.raca.nome}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Porte</h6>
                                                            <p>{animal.raca && animal.raca.porte ? animal.raca && animal.raca.porte : 'Não definido'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Data de nascimento</h6>
                                                            <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : 'Não definida'}</p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Alergias</h6>
                                                            <p>{animal.alergias ? animal.alergias : 'Não definidas'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Número da ficha</h6>
                                                            <p>{animal.numeroFicha ? animal.numeroFicha : 'Não definido'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Tutor</h6>
                                                            <p>{tutor.nome ? tutor.nome : 'Não definido'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <h2>Anamnese</h2>
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Peso:
                                <input type="text" name="peso" value={formData.peso} onChange={handleChange} placeholder="Digite o peso" />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Ambiente:
                                <select name="ambiente"
                                    value={formData.ambiente}
                                    onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Casa">Casa</option>
                                    <option value="Casa/Quintal">Casa/Quintal</option>
                                    <option value="Sítio/Fazenda">Sítio/Fazenda</option>
                                    <option value="Apartamento">Apartamento</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Estilo de vida:
                                <select name="estiloVida" value={formData.estiloVida} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Domiciliado">Domiciliado</option>
                                    <option value="Extradomiciliado">Extradomiciliado</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Acesso à rua:
                                <select name="acessoRua" value={formData.acessoRua} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Livre">Livre</option>
                                    <option value="Controlado">Controlado</option>
                                    <option value="Sem acesso">Sem acesso</option>
                                </select>
                            </label>
                        </div>

                        <div className={styles.column}>
                            <label>Alimentação:
                                <select name="alimentacao" value={formData.alimentacao} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Ração">Ração</option>
                                    <option value="Ração + Dieta Caseira">Ração + Dieta Caseira</option>
                                    <option value="Dieta caseira">Dieta Caseira</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Última administração:
                                <input type="date" name="ultimaAdministracao" value={formData.ultimaAdministracao} onChange={handleChange} placeholder="Digite a data" />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Apresenta ectoparasitas:
                                <select name="apresentaEctoparasitas" value={formData.apresentaEctoparasitas} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Não">Não</option>
                                    <option value="Pulgas">Pulgas</option>
                                    <option value="Carrapatos">Carrapatos</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Quando visto pela última vez:
                                <select name="quandoVistoUltimaVez" value={formData.quandoVistoUltimaVez} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Menos de 1 mês">Menos de 1 mês</option>
                                    <option value="Mais de 1 mês">Mais de 1 mês</option>
                                    <option value="Mais de 3 meses">Mais de 3 meses</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Banhos:
                                <select name="banhos" value={formData.banhos} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Casa">Casa</option>
                                    <option value="Pet shop">Pet Shop</option>
                                    <option value="Não">Não</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Frequência de banhos:
                                <select name="frequenciaBanhos" value={formData.frequenciaBanhos} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Semanal">Semanal</option>
                                    <option value="Quinzenal">Quinzenal</option>
                                    <option value="Mensal">Mensal</option>
                                    <option value="Outras">Outras</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Produtos utilizados:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Xampu Cam/fel", "Xampu humano",
                            "Sabonete/Xampu Antipulgas", "Terapêutico",
                            "Outros",
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.produtosUtilizados.includes(item)}
                                    onChange={(e) => handleCheckboxChangeOutros(e, "produtosUtilizados", setShowOtherInputProdutosUtilizados, setOtherValueProdutosUtilizados)}
                                /> {item}
                            </label>
                        ))}
                    </div>
                    {showOtherInputProdutosUtilizados && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueProdutosUtilizados}
                            onChange={(e) => setOtherValueProdutosUtilizados(e.target.value)}
                        />
                    )}
                    <div className={styles.column}>
                        <label>Contato Com:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Tapete", "Cerâmica",
                            "Plantas", "Grama", "Cimento",
                            "Terra",
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["contatoComSuperfice"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "contatoComSuperfice")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                    <div className={styles.column}>
                        <label>Convive com outros animais:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Não", "cães", "Gatos", "Outros",].map((item) => (
                                <label key={item}>
                                    <input
                                        type="checkbox"
                                        value={item}
                                        checked={formData.conviveComAnimais.includes(item)}
                                        onChange={(e) => handleCheckboxChangeOutros(e, "conviveComAnimais", setShowOtherInputConviveComAnimais, setOtherValueConviveComAnimais)}
                                    /> {item}
                                </label>
                            ))}
                    </div>
                    {showOtherInputConviveComAnimais && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueConviveComAnimais}
                            onChange={(e) => setOtherValueConviveComAnimais(e.target.value)}
                        />
                    )}
                    <div className={styles.column}>
                        <label>Contactantes Sintomáticos:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Não", "cães",
                            "Gatos", "Humanos",
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["contactantesSintomaticos"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "contactantesSintomaticos")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                    <div className={styles.column}>
                        <label>Controle de Ectoparasitas:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Nenhum", "Banhos",
                            "Pipetas", "Comprimido",
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["controleEctoparasitas"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "controleEctoparasitas")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label>Queixa principal(Início/ Aspecto/ Evolução):
                            <textarea type="text" name="queixaPrincipal" value={formData.queixaPrincipal} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    {/* Tratamentos Atuais */}
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Tratamentos atuais:
                                <select name="tratamentosAtuais.confirmacao" value={formData.tratamentosAtuais?.confirmacao || ""}
                                    onChange={handleTratamentoChange}>
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não </option>
                                </select>
                            </label>


                            {/* Se SIM for selecionado, mostra as opções de tratamento */}
                            {formData.tratamentosAtuais?.confirmacao === "Sim" && (
                                <div className={`${styles.column} ${styles.subField}`}>
                                    <label>Tipo de tratamento:
                                        <select name="tratamentosAtuais.tipoTratamento" value={formData.tratamentosAtuais?.tipoTratamento || ""}
                                            onChange={handleChange}>
                                            <option value="">Selecione</option>
                                            <option value="Tópico">Tópico</option>
                                            <option value="Sistêmico">Sistêmico </option>
                                        </select>
                                    </label>

                                    {/* Se Tópico ou Sistêmico for selecionado, mostra responsividade */}
                                    {formData.tratamentosAtuais?.tipoTratamento && (
                                        <div className={styles.column}>
                                            <label>Responsividade:
                                                <select name="tratamentosAtuais.responsividade" value={formData.tratamentosAtuais?.responsividade || ""}
                                                    onChange={handleChange}>
                                                    <option value="">Selecione</option>
                                                    <option value="Responsivo">Responsivo</option>
                                                    <option value="Não responsivo">Não responsivo </option>
                                                    <option value="Parcialmente responsivo">Parcialmente responsivo</option>
                                                </select>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        <div className={styles.column}>
                            <label>Prurido:
                                <select name="prurido" value={formData.prurido} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Nao">Não</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label className={styles.title}>Local</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Perilabial", "Periocular",
                            "Orelhas", "Axila", "Tórax",
                            "Abdomen", "Membros",
                            "Lombo-sacral", "Perianal",
                            "Perivulvar"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["local"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "local")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                        <div className={styles.box}>
                    <div className={styles.column}>
                        <label>Intensidade:
                            <select name="intensidade" value={formData.intensidade} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="Leve">Leve</option>
                                <option value="Moderado">Moderado</option>
                                <option value="Intenso">Intenso</option>
                            </select>
                        </label>
                    </div>

                    <div className={styles.column}>
                        <label>Lambedura de patas:
                            <select name="lambedura" value={formData.lambedura} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>
                    </div>
                    </div>
                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        < ContinuarFichasGreenButton type="submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FichaDermatologicaStep1;