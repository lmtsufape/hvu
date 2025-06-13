import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

function FichaNeurologica({ formData, handleChange, prevStep, handleCheckboxChange, handleSubmit }) {

    const [errors, setErrors] = useState(null);
    const errorRefs = useRef({});

    // Função para registrar referências de erro
    const registerErrorRef = (fieldName, element) => {
        if (element) {
            errorRefs.current[fieldName] = element;
        }
    };

    // Efeito para rolar até o primeiro erro
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = errorRefs.current[firstErrorField];

            if (errorElement) {
                errorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }, [errors]);

    const localHandleSubmit = (event) => {

        setErrors({});
        const validation = validateForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        console.log("Formulário válido. Dados prontos para envio:", formData);
        handleSubmit(event);
    };

    function validateForm(formData) {
        const errors = {};

        // Validação da Medula Espinhal
        if (formData.diagnosticoAnatomico.localLesao.includes("Medula espinhal") &&
            (!formData.diagnosticoAnatomico.subniveisMedula ||
                formData.diagnosticoAnatomico.subniveisMedula.length === 0)) {
            errors.medulaEspinhal = "Selecione ao menos uma opção para Medula Espinhal";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
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

    return (
        <div className={styles.container}>
            <VoltarButton onClick={prevStep} />
            <h1>Ficha Neurológica</h1>
            <div className={styles.form_box}>

                <form onSubmit={localHandleSubmit}>
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
                    <h1 className={styles.title}>Diagnóstico anatômico</h1>

                    <div className={styles.column}>
                        <label>Local da lesão: </label>
                        <div className={styles.checkbox_container}>
                            {[
                                "Cerebral",
                                "Diencéfalo",
                                "Cerebelo",
                                "Vestibular central / Periférico",
                                "Medula espinhal",
                                "neuromuscularGeneralizado"
                            ].map((item) => (
                                <div key={item} className={styles.checkbox_group}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={item}
                                            checked={formData.diagnosticoAnatomico.localLesao.includes(item)}
                                            onChange={(e) => handleCheckboxChange(e, "diagnosticoAnatomico.localLesao")}
                                            ref={el => item === "Medula espinhal" ? registerErrorRef('medulaEspinhal', el) : null}
                                        />
                                        {item.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>

                                    {item === "Medula espinhal" && formData.diagnosticoAnatomico.localLesao.includes("Medula espinhal") && (
                                        <div className={styles.suboptions}>
                                            {["C1-C5", "C6-T2", "T3-L3", "L4-S1", "S1-S3"].map((subitem) => (
                                                <label key={subitem} className={styles.subcheckbox}>
                                                    <input
                                                        type="checkbox"
                                                        value={subitem}
                                                        checked={formData.diagnosticoAnatomico.subniveisMedula?.includes(subitem) || false}
                                                        onChange={(e) => handleCheckboxChange(e, "diagnosticoAnatomico.subniveisMedula")}
                                                    />
                                                    {subitem}
                                                </label>
                                            ))}
                                            {errors && errors.medulaEspinhal && (
                                                <div className="text-danger" style={{ color: 'red', marginTop: '5px' }}>
                                                    {errors.medulaEspinhal}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className={styles.column}>
                        <label>Nervo periferico:
                            <input type="text" name="diagnosticoAnatomico.nervoPeriferico"
                                value={formData.diagnosticoAnatomico.nervoPeriferico}
                                onChange={handleChange} />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Suspeita(s) clínica(s):
                            <textarea name="diagnosticoAnatomico.suspeitasClinicas" value={formData.diagnosticoAnatomico.suspeitasClinicas} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Exame(s) complementare(s):
                            <textarea name="diagnosticoAnatomico.examesComplementares" value={formData.diagnosticoAnatomico.examesComplementares} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Prognóstico:
                            <textarea name="diagnosticoAnatomico.prognostico" value={formData.diagnosticoAnatomico.prognostico} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Diagnóstico:
                            <textarea name="diagnosticoAnatomico.diagnostico" value={formData.diagnosticoAnatomico.diagnostico} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Tratamento:
                            <textarea name="diagnosticoAnatomico.tratamento" value={formData.diagnosticoAnatomico.tratamento} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Plantonista(s) discentes:
                            <input type="text" name="plantonistasDiscentes"
                                value={formData.plantonistasDiscentes}
                                onChange={handleChange} />
                        </label>
                    </div>

                    <div className={styles.button_box}>
                        < VoltarWhiteButton onClick={prevStep} />
                        < FinalizarFichaModal onConfirm={localHandleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FichaNeurologica;