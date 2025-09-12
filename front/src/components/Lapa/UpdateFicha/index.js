"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "./index.module.css"
import { updateFichaSolicitacao, getFichaSolicitacaoById } from "../../../../services/fichaSolicitacaoService"
import TutorList from "@/hooks/useTutorList"
import MedicoList from "@/hooks/useMedicoList"
import VoltarButton from "../../VoltarButton"
import Alert from "@/components/Alert"
import ErrorAlert from "@/components/ErrorAlert"
import { Modal, Button } from "react-bootstrap"
import { getToken, getRoles } from "../../../../services/userService"

function UpdateFicha() {
  const router = useRouter()
  const { id } = router.query
  const roles = getRoles()
  const token = getToken()

  const { tutores } = TutorList()
  const { medicos } = MedicoList()

  const [showModal, setShowModal] = useState(false)
  const [showMedicoModal, setShowMedicoModal] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [searchError, setSearchError] = useState(false)
  const [searchTermMedico, setSearchTermMedico] = useState("")
  const [searchErrorMedico, setSearchErrorMedico] = useState(false)

  const [filteredTutores, setFilteredTutores] = useState([])
  const [filteredMedicos, setFilteredMedicos] = useState([])
  const [filteredAnimals, setFilteredAnimals] = useState([])

  const [selectedTutor, setSelectedTutor] = useState(null)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [selectedMedico, setSelectedMedico] = useState(null)

  const [showAlert, setShowAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(true)

  const [fichaDeSolicitacaoData, setFichaDeSolicitacaoData] = useState({
    fichaClinica: "",
    tipoServico: "",
    dataHoraObito: "",
    dataRecebimento: "",
    estadoConservacao: "",
    acondicionamento: "",
    eutanasia: false,
    historico: "",
    caracteristicasAdicionais: "",
    tutor: { id: null },
    animal: { id: null, origemAnimal: null },
    medico: { id: null },
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (id && tutores.length > 0 && medicos.length > 0) {
      const fetchFichaData = async () => {
        try {
          const fichaData = await getFichaSolicitacaoById(id)

          const formatDateForInput = (dateString) => {
            if (!dateString) return ""
            const date = new Date(dateString)
            const offset = date.getTimezoneOffset()
            const adjustedDate = new Date(date.getTime() - offset * 60 * 1000)
            return adjustedDate.toISOString().slice(0, 16)
          }

          setFichaDeSolicitacaoData({
            fichaClinica: fichaData.fichaClinica || "",
            tipoServico: fichaData.tipoServico || "",
            dataHoraObito: formatDateForInput(fichaData.dataHoraObito),
            dataRecebimento: formatDateForInput(fichaData.dataRecebimento),
            estadoConservacao: fichaData.estadoConservacao || "",
            acondicionamento: fichaData.acondicionamento || "",
            eutanasia: fichaData.eutanasia || false,
            historico: fichaData.historico || "",
            caracteristicasAdicionais: fichaData.caracteristicasAdicionais || "",
            tutor: { id: fichaData.tutor?.id || null },
            animal: { id: fichaData.animal?.id || null, origemAnimal: fichaData.animal?.origemAnimal || null },
            medico: { id: fichaData.medico?.id || null },
          })

          if (fichaData.tutor) {
            const tutor = tutores.find((t) => t.id === fichaData.tutor.id)
            if (tutor) {
              setSelectedTutor(fichaData.tutor.id)
              setSearchTerm(tutor.nome)
              setFilteredAnimals(tutor.animais || [])
            }
          }

          if (fichaData.animal) {
            setSelectedAnimal(fichaData.animal.id)
          }

          if (fichaData.medico) {
            const medico = medicos.find((m) => m.id === fichaData.medico.id)
            if (medico) {
              setSelectedMedico(fichaData.medico.id)
              setSearchTermMedico(medico.nome)
            }
          }

          setLoading(false)
        } catch (error) {
          console.error("Error loading ficha data:", error)
          setShowErrorAlert(true)
          setErrorMessage("Erro ao carregar dados da ficha.")
          setLoading(false)
        }
      }

      fetchFichaData()
    }
  }, [id, tutores, medicos])

  if (!token)
    return (
      <div className={styles.container}>
        <h3>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    )
  if (!roles.includes("patologista"))
    return (
      <div className={styles.container}>
        <h3>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    )

  if (loading) {
    return (
      <div className={styles.container}>
        <h3>Carregando dados da ficha...</h3>
      </div>
    )
  }

  const handleSearch = (event) => {
    const term = event.target.value
    setSearchTerm(term)

    if (term) {
      const filtered = tutores.filter(
        (t) => t.id.toString().includes(term) || t.nome.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredTutores(filtered)
      setSearchError(false)
    } else {
      setFilteredTutores([])
      setSearchError(true)
    }
  }

  const handleTutorSelection = (tutor) => {
    if (!tutor || !tutor.id) return

    setSelectedTutor(tutor.id)
    setFichaDeSolicitacaoData((prev) => ({
      ...prev,
      tutor: { id: tutor.id },
      animal: { id: null, origemAnimal: null },
    }))

    setFilteredAnimals(tutor.animais || [])
    setShowModal(false)
    setSearchTerm(tutor.nome)
    setSelectedAnimal(null)
  }

  const handleAnimalSelection = (e) => {
    const animalId = Number.parseInt(e.target.value, 10)
    const animal = filteredAnimals.find((a) => a.id === animalId)
    setSelectedAnimal(animalId)

    setFichaDeSolicitacaoData((prev) => ({
      ...prev,
      animal: { id: animalId, origemAnimal: animal?.origemAnimal || null },
    }))
  }

  const handleMedicoSearch = (event) => {
    const term = event.target.value
    setSearchTermMedico(term)

    if (term) {
      const filtered = medicos.filter(
        (m) => m.id.toString().includes(term) || m.nome.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredMedicos(filtered)
      setSearchErrorMedico(false)
    } else {
      setFilteredMedicos([])
    }
  }

  const handleMedicoSelection = (medico) => {
    setSelectedMedico(medico.id)
    setFichaDeSolicitacaoData((prev) => ({
      ...prev,
      medico: { id: medico.id },
    }))
    setShowMedicoModal(false)
    setSearchTermMedico(medico.nome)
  }

  const handleFichaDeSolicitacaoChange = (event) => {
    const { name, value, type, checked } = event.target
    const newValue = type === "checkbox" ? checked : value

    setFichaDeSolicitacaoData((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const formatDate = (date) => (date ? new Date(date).toISOString() : "")

  const validateForm = () => {
    const newErrors = {}
    if (!fichaDeSolicitacaoData.fichaClinica) newErrors.fichaClinica = "Ficha Clínica é obrigatória."
    if (!fichaDeSolicitacaoData.tipoServico) newErrors.tipoServico = "Tipo de Serviço é obrigatório."
    if (!fichaDeSolicitacaoData.dataHoraObito) newErrors.dataHoraObito = "Data e Hora do Óbito são obrigatórias."
    if (!fichaDeSolicitacaoData.dataRecebimento) newErrors.dataRecebimento = "Data de Recebimento é obrigatória."
    if (!fichaDeSolicitacaoData.estadoConservacao) newErrors.estadoConservacao = "Estado de Conservação é obrigatório."
    if (!fichaDeSolicitacaoData.acondicionamento) newErrors.acondicionamento = "Acondicionamento é obrigatório."
    if (!fichaDeSolicitacaoData.tutor.id) newErrors.tutor = "Selecione um Tutor."
    if (!fichaDeSolicitacaoData.animal.id) newErrors.animal = "Selecione um Animal."
    if (!fichaDeSolicitacaoData.medico.id) newErrors.medico = "Selecione um Médico."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    const fichaToUpdate = {
      ...fichaDeSolicitacaoData,
      dataHoraObito: formatDate(fichaDeSolicitacaoData.dataHoraObito),
      dataRecebimento: formatDate(fichaDeSolicitacaoData.dataRecebimento),
    }

    try {
      await updateFichaSolicitacao(id, fichaToUpdate)
      setShowAlert(true)
    } catch (error) {
      console.error(error)
      setShowErrorAlert(true)
      setErrorMessage("Erro ao atualizar ficha de solicitação, tente novamente.")
    }
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Editar Ficha de Solicitação de Serviço - Necropsia/Laudo</h1>

      <form className={styles.form_box} onSubmit={handleSubmit}>
        <div className="row">
          <h2>Identificação do Tutor</h2>
          <div className="col">
            <label htmlFor="search" className="form-label">
              Pesquisar Tutor
            </label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${searchError ? "is-invalid" : ""}`}
                placeholder="Digite o ID ou nome do tutor"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>
                Buscar
              </button>
            </div>
            {searchError && <div className="invalid-feedback">Por favor, digite um termo de pesquisa válido.</div>}
            {errors.tutor && <div className="invalid-feedback d-block">{errors.tutor}</div>}
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Selecione o Tutor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filteredTutores.length > 0 ? (
              <ul className="list-group">
                {filteredTutores.map((tutor) => (
                  <li
                    key={tutor.id}
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTutorSelection(tutor)}
                  >
                    <strong>Nome:</strong> {tutor.nome}
                    <br />
                    <strong>Email:</strong> {tutor.email || "N/A"}
                    <br />
                    <strong>Telefone:</strong> {tutor.telefone || "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum tutor encontrado.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="row">
          <h2>Identificação do Animal</h2>
          <div className="col">
            <label htmlFor="animal" className="form-label">
              Animal
            </label>
            <select
              className={`form-select ${errors.animal ? "is-invalid" : ""}`}
              name="animal"
              value={selectedAnimal || ""}
              onChange={handleAnimalSelection}
            >
              <option value="">Selecione um animal</option>
              {filteredAnimals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome} {animal.origemAnimal ? `(${animal.origemAnimal})` : ""}
                </option>
              ))}
            </select>
            {errors.animal && <div className="invalid-feedback">{errors.animal}</div>}
            {fichaDeSolicitacaoData.animal?.origemAnimal === "HVU" && (
              <button
                type="button"
                className={styles.hist_button}
                onClick={() =>
                  window.open(`/getAllConsultas/${fichaDeSolicitacaoData.animal.id}`, "_blank", "noopener,noreferrer")
                }
              >
                Visualizar histórico
              </button>
            )}
          </div>
        </div>

        <div className="row">
          <h2>Informações sobre o Material</h2>
          <div className="col">
            <label htmlFor="dataHoraObito" className="form-label">
              Data e Hora do Óbito
            </label>
            <input
              type="datetime-local"
              className={`form-control ${errors.dataHoraObito ? "is-invalid" : ""}`}
              id="dataHoraObito"
              name="dataHoraObito"
              value={fichaDeSolicitacaoData.dataHoraObito}
              onChange={handleFichaDeSolicitacaoChange}
            />
            {errors.dataHoraObito && <div className="invalid-feedback">{errors.dataHoraObito}</div>}
          </div>
          <div className="col">
            <label htmlFor="estadoConservacao" className="form-label">
              Estado de Conservação
            </label>
            <select
              className={`form-select ${errors.estadoConservacao ? "is-invalid" : ""}`}
              id="estadoConservacao"
              name="estadoConservacao"
              value={fichaDeSolicitacaoData.estadoConservacao}
              onChange={handleFichaDeSolicitacaoChange}
            >
              <option value="">Selecione o estado de conservação</option>
              <option value="BOM">Bom</option>
              <option value="REGULAR">Regular</option>
              <option value="RUIM">Ruim</option>
            </select>
            {errors.estadoConservacao && <div className="invalid-feedback">{errors.estadoConservacao}</div>}
          </div>
          <div className="col">
            <label htmlFor="eutanasia" className="form-label">
              Eutanásia
            </label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="eutanasia"
                checked={fichaDeSolicitacaoData.eutanasia}
                onChange={handleFichaDeSolicitacaoChange}
              />
              <label className="form-check-label" htmlFor="eutanasia">
                Realizada
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label htmlFor="historico" className="form-label">
              Histórico
            </label>
            <textarea
              className={`form-control ${errors.historico ? "is-invalid" : ""}`}
              name="historico"
              placeholder="Insira o Histórico"
              value={fichaDeSolicitacaoData.historico}
              onChange={handleFichaDeSolicitacaoChange}
            />
          </div>
          <div className="col">
            <label htmlFor="caracteristicasAdicionais" className="form-label">
              Características Adicionais
            </label>
            <input
              type="text"
              className={`form-control ${errors.caracteristicasAdicionais ? "is-invalid" : ""}`}
              name="caracteristicasAdicionais"
              placeholder="Insira as Características Adicionais"
              value={fichaDeSolicitacaoData.caracteristicasAdicionais}
              onChange={handleFichaDeSolicitacaoChange}
            />
          </div>
          <div className="col">
            <label htmlFor="fichaClinica" className="form-label">
              Ficha Clínica
            </label>
            <input
              type="text"
              className={`form-control ${errors.fichaClinica ? "is-invalid" : ""}`}
              name="fichaClinica"
              placeholder="Insira a Ficha Clínica"
              value={fichaDeSolicitacaoData.fichaClinica}
              onChange={handleFichaDeSolicitacaoChange}
            />
            {errors.fichaClinica && <div className="invalid-feedback">{errors.fichaClinica}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label htmlFor="dataRecebimento" className="form-label">
              Data de Recebimento
            </label>
            <input
              type="datetime-local"
              className={`form-control ${errors.dataRecebimento ? "is-invalid" : ""}`}
              id="dataRecebimento"
              name="dataRecebimento"
              value={fichaDeSolicitacaoData.dataRecebimento}
              onChange={handleFichaDeSolicitacaoChange}
            />
            {errors.dataRecebimento && <div className="invalid-feedback">{errors.dataRecebimento}</div>}
          </div>
          <div className="col">
            <label htmlFor="acondicionamento" className="form-label">
              Acondicionamento
            </label>
            <select
              className={`form-select ${errors.acondicionamento ? "is-invalid" : ""}`}
              name="acondicionamento"
              value={fichaDeSolicitacaoData.acondicionamento}
              onChange={handleFichaDeSolicitacaoChange}
            >
              <option value="">Selecione o tipo de acondicionamento</option>
              <option value="CONGELADO">Congelado</option>
              <option value="RESFRIADO">Resfriado</option>
              <option value="NATURAL">Natural</option>
            </select>
            {errors.acondicionamento && <div className="invalid-feedback">{errors.acondicionamento}</div>}
          </div>
          <div className="col">
            <label htmlFor="tipoServico" className="form-label">
              Tipo de Serviço
            </label>
            <select
              className={`form-select ${errors.tipoServico ? "is-invalid" : ""}`}
              name="tipoServico"
              value={fichaDeSolicitacaoData.tipoServico}
              onChange={handleFichaDeSolicitacaoChange}
            >
              <option value="">Selecione o tipo de Serviço</option>
              <option value="NECROPSIA">Necropsia</option>
              <option value="MICROSCOPIA">Microscopia</option>
              <option value="NECROPSIA_COM_MICROSCOPIA">Necropsia com Microscopia</option>
            </select>
            {errors.tipoServico && <div className="invalid-feedback">{errors.tipoServico}</div>}
          </div>
        </div>

        <div className="row">
          <h2>Identificação do Veterinário</h2>
          <div className="col">
            <label htmlFor="searchMedico" className="form-label">
              Pesquisar Veterinário
            </label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${searchErrorMedico ? "is-invalid" : ""}`}
                id="searchMedico"
                placeholder="Digite o ID ou nome do médico"
                value={searchTermMedico}
                onChange={handleMedicoSearch}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowMedicoModal(true)}>
                Buscar
              </button>
            </div>
            {searchErrorMedico && (
              <div className="invalid-feedback">Por favor, digite um termo de pesquisa válido.</div>
            )}
            {errors.medico && <div className="invalid-feedback d-block">{errors.medico}</div>}
          </div>
        </div>

        <Modal show={showMedicoModal} onHide={() => setShowMedicoModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Selecione o Médico Veterinário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filteredMedicos.length > 0 ? (
              <ul className="list-group">
                {filteredMedicos.map((medico) => (
                  <li
                    key={medico.id}
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleMedicoSelection(medico)}
                  >
                    <strong>Nome:</strong> {medico.nome} <br />
                    <strong>Email:</strong> {medico.email} <br />
                    <strong>Telefone:</strong> {medico.telefone} <br />
                    <strong>CRMV:</strong> {medico.crmv}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum médico veterinário encontrado.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMedicoModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className={styles.button_container}>
          <button className={styles.cadastrar_button} type="submit">
            Atualizar
          </button>
        </div>
      </form>

      <Alert
        message="Ficha de Solicitação atualizada com sucesso!"
        show={showAlert}
        url="/lapa/telaprincipallaudos/laudosEmAndamento"
      />
      {showErrorAlert && <ErrorAlert message={errorMessage} show={showErrorAlert} />}
    </div>
  )
}

export default UpdateFicha
