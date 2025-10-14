import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';
import { getCurrentUsuario } from "../../../../../services/userService";
import { getMedicoById } from "../../../../../services/medicoService";

const DIAGNOSTICO = [
  { key: "diagnostico", label: "Diagnóstico(s)" },
  { key: "observacoes", label: "Observações" },
  { key: "prognostico", label: "Prognóstico" },
  { key: "peso", label: "Peso (kg)" }
];

function AtendimentoCardiologico({
  formData,
  handleChange,
  prevStep,
  handleSubmit,
  removerUltimaLinhaTratamento,
  adicionarLinhaTratamento,
  handleChangeTratamentos,
  medicacoes,
}) {

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [consultaId, setConsultaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [medicoLogado, setMedicoLogado] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const id = router.query.fichaId;
      const animalId = router.query.animalId;
      const aId = router.query.agendamentoId;
      if (id) {
        setConsultaId(id);
      }
      if (aId) {
        setAgendamentoId(aId);
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

  useEffect(() => {
    const fetchMedicoData = async () => {
        try {
            // Passo 1: Busca o usuário atual para obter o ID
            const userData = await getCurrentUsuario();
            const medicoId = userData.usuario.id;

            if (medicoId) {
                // Passo 2: Usa o ID para buscar os dados COMPLETOS do médico
                const medicoCompletoData = await getMedicoById(medicoId);
                
                // Passo 3: Armazena o objeto COMPLETO (que tem o CRMV) no estado
                setMedicoLogado(medicoCompletoData);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do médico logado:', error);
        }
    };

    fetchMedicoData();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  medicacoes = medicacoes || [{ medicacao: "", dose: "", frequencia: "", periodo: "" }];
  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha de Atendimento Cardiológico</h1>
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
          <h2>Exames Complementares</h2>

          <div className={styles.column}>
            <label className="form-label fw-medium">Exames anteriores solicitados</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="ExamesComplementares.examesAnteriores"
              value={formData?.ExamesComplementares?.examesAnteriores || ""}
              onChange={handleChange}
              className="form-control" />
          </div>
          {/* ================= DIAGNÓSTICO & TRATAMENTO ================= */}
          <div className={styles.column}>
            <div className="card-body">
              <h2>Diagnóstico e tratamento</h2>

              {DIAGNOSTICO.map(field => (
                <div key={field.key} className="mb-3">
                  <label className="form-label fw-medium" htmlFor={field.key}>
                    {field.label}
                  </label>

                  {field.key === "peso" ? (
                    <input
                      id={field.key}
                      type="number"
                      min="0"
                      step="0.01"
                      name={`diagnostico.${field.key}`}
                      className="form-control"
                      placeholder="Informe o peso em kg"
                      value={formData.diagnostico?.[field.key] || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <textarea
                      id={field.key}
                      rows={4}
                      name={`diagnostico.${field.key}`}
                      className="form-control"
                      value={formData.diagnostico?.[field.key] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ================= TABELA DE MEDICAÇÕES ================= */}

            <div className={styles.column}>
              <h2>Tratamento</h2>
              <table className={styles.tabela_tratamento}>
                <thead>
                  <tr>
                    <th id="medicacao"> Medicação</th>
                    <th>Dose</th>
                    <th>Frequência</th>
                    <th>Período</th>
                  </tr>
                </thead>
                <tbody>
                  {medicacoes.map((linha, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={linha.medicacao}
                          onChange={(e) => handleChangeTratamentos(index, "medicacao", e.target.value)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={linha.dose}
                          onChange={(e) => handleChangeTratamentos(index, "dose", e.target.value)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={linha.frequencia}
                          onChange={(e) => handleChangeTratamentos(index, "frequencia", e.target.value)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={linha.periodo}
                          onChange={(e) => handleChangeTratamentos(index, "periodo", e.target.value)}
                          className="form-control"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.bolha_container}>
                <div className={styles.bolha} onClick={adicionarLinhaTratamento}>
                  +
                </div>
                <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaLinhaTratamento}>
                  -
                </div>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <label>Plantonista(s) discente(s): </label>
            <textarea name="plantonistas" value={formData.plantonistas} onChange={handleChange}
              className="form-control" />

          </div>
          <div className={styles.assinaturaSombreada}>
                  {medicoLogado ? (
                  <p style={{ margin: 0 }}>
                    Assinado eletronicamente por <strong>Dr(a). {medicoLogado.nome}</strong>, CRMV {medicoLogado.crmv}
                  </p>
                  ) : (
                  <p style={{ margin: 0 }}>Carregando dados do médico...</p>
               )}
          </div>


          <div className={styles.button_box}>
            < VoltarWhiteButton onClick={prevStep} />
            < FinalizarFichaModal onConfirm={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AtendimentoCardiologico;

