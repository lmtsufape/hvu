import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import React, { useState, useEffect, useRef } from "react";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

function FichaNeurologica({ formData, handleChange, nextStep, handleCheckboxChange, cleanLocalStorage }) {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulário válido. Dados prontos para envio:", formData);
        nextStep();
    };

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
            <VoltarButton />
            <h1>Ficha Neurológica</h1>
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

                    <div className={styles.titulo}>
                        Estado mental
                    </div>

                    <div className={styles.column}>
                        <label>Nível de consciência ( Troco encefálico e córtex - SARA):
                            <textarea name="nivelConsciencia" value={formData.nivelConsciencia} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Resultados dos exames realizados:
                            <textarea name="resultadoExame" value={formData.resultadoExame} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <div className={styles.titulo}>
                        Postura (Circular)
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Estação", "Cabeça inclinada (D/E)", "Cabeça virada (D/E)", "Queda",
                            "Tetania", "Tremor", "Descerebrada", "Descerebelada",
                            "Schiff-sherrington", "Decubito", "Outro"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["postura"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "postura")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>

                    <div className={styles.titulo}>
                        Locomoção (Integração entre visão, equilíbrio, propriocepção e função motora)
                    </div>
                    <div className={styles.column}>
                        <label>Descrição e membros afetados:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Normal", "Claudicação", "Ataxia", "Paresia"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["descricaoLocomocao"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "descricaoLocomocao")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>

                    <div className={styles.titulo}>
                        Tipo de ataxia
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "vestibular", "cerebelar", "proprioceptiva"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["tipoAtaxia"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "tipoAtaxia")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label>Andar compulsivo?</label>
                        <select id="meia-caixa" name="andarCompulsivo" value={formData.andarCompulsivo} onChange={handleChange} >
                            <option value="">Selecione</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
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

export default FichaNeurologica;