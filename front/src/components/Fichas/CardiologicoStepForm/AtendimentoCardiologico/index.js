import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';


const ALIMENTACAO_OPTS  = [" Ração", " Dieta caseira", " Ração + Dieta caseira"];
const ESTILO_VIDA_OPTS  = [" Domiciliado", " Extradomiciliado", " Área endêmica para Dirofilariose"];

function AtendimentoCardiologico({
    formData,
    handleChange,
    nextStep,
    cleanLocalStorage,
    handleCheckboxChangeVacinacao,
    handleLocationChange,
    handleCheckboxChange
}) {

    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [consultaId, setConsultaId] = useState(null);
    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor, setTutor] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulário válido. Dados prontos para envio:", formData);
        nextStep();
    };
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


    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Atendimento Cardiologico</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    <h2 className={styles.title}>Anamnese</h2>

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
                                                <div className={styles.box}>
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

                    <div className={styles.column}>
                        <label>Peso:</label>
                        <input
                            type="text"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                            style={{
                                width: "310px", // Define uma largura menor
                            }}
                        />
                    </div>

                    <div className="row fw-medium mb-2">
                        <div className="col-3 mb-3 mt-4">Vacinação</div>
                        <div className="col mt-4 mb-3">
                            Produto e data de aplicação:
                        </div>

                        <div >
                        {formData.opc && Object.keys(formData.opc).map((opc) => (
                        <div key={opc} className="row align-items-start mb-2">
                            <div className={`${styles.checkbox_container} ${styles.checkbox_square} col-3`}>
                            <label className="d-flex align-items-center">
                            <input
                                type="checkbox"
                                name={opc}
                                checked={formData.opc[opc]}
                                onChange={handleCheckboxChangeVacinacao}
                                className="me-2"
                            />
                            {opc === "antiRabica" && "anti-Rábica"}
                            {opc === "giardia" && "Giardia"}
                            {opc === "leishmaniose" && "Leishmaniose"}
                            {opc === "tosseDosCanis" && "Tose dos Canis"}
                            {opc === "polivalenteCanina" && "Polivalente Canina"}
                            {opc === "polivalenteFelina" && "Polivalente Felina"}
                            {opc === "outros" && "Outros"}
                            {opc === "naoInformado" && "Não informados"}
                            {opc === "naoVacinado" && "Não vacinado"}
                            </label>
                            </div>
                            
                            <div className="col">
                                <input
                                type="text"
                                name={opc}
                                value={formData.vacinacao[opc]}
                                onChange={handleLocationChange}
                                disabled={!formData.opc[opc]}
                                className="form-control"
                                />
                            </div>
                        </div>
                        ))}
                        </div>
                    </div>

                    <div className={styles.column}>
                        <label className="form-label fw-medium">Alimentação</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {ALIMENTACAO_OPTS.map(opt => (
                            <label key={opt} >
                                <input
                                    type="radio"
                                    name="alimentacao"
                                    value={opt}
                                    checked={formData.alimentacao === opt}
                                    onChange={handleChange}
                                /> {opt}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label className="form-label fw-medium">Estilo de Vida</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {ESTILO_VIDA_OPTS.map(opt => (
                            <label key={opt} >
                                <input
                                    type="radio"
                                    name="estiloVida"
                                    value={opt}
                                    checked={formData.estiloVida === opt}
                                    onChange={handleChange}
                                /> {opt}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label className="form-label fw-medium">Contactantes/Ambiente/Manejo domissanitário/Tabagismo passivo</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            name="contactantes"
                            value={formData?.contactantes || ""}
                            onChange={handleChange}
                            className="form-control" />
                    </div>

                    <div className={styles.column}>
                        <label>Sinais Clinicos</label>
                    </div>
                    <div className={`${styles.checkbox_container} ${styles.checkbox_square} ${styles.inputs_three_columns}`}>
                        {[
                            "Cansaço facil/Intolerância à atividade física", " Inquietação noturna/ortopnéica",
                            "Síncope", "Espirro/Espirro reverso", "Perda aguda de visão",
                            "Aumento de volume abdominal", "Edema periférico", "Paralisia",
                            "Polifagia", "Polidipsia", "Oligodipsia", "Anúria",
                            "Dispnéia", " Pré-síncope",
                            "Tosse", "Epistaxe", "Cianose",
                            "Paresia", "Poliúria", "Oligúria",
                            "Adipisia", "Sem alterações",
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["sinaisClinicos"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "sinaisClinicos")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>

                        <label>Antecedentes familiares / Histórico de doenças e tratamentos / Respostas (anterior e atual)</label>
                            <textarea name="antecedentesHistorico" 
                            value={formData.antecedentesHistorico} 
                            onChange={handleChange} rows="4" cols="50" />
                        

                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage} />
                        < ContinuarFichasGreenButton type="submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AtendimentoCardiologico;
