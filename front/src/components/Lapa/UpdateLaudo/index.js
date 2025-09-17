"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from "./index.module.css"
import VoltarButton from "../VoltarButton"
import { CancelarWhiteButton } from "../../WhiteButton"
import { updateLaudoNecropsia, getLaudoNecropsiaById } from "../../../../services/laudoNecropsiaService"
import Alert from "../../Alert"
import ErrorAlert from "../../ErrorAlert"
import FichaSolicitacaoServicoList from "@/hooks/useFichaSolicitacaoList"
import { Modal, Button } from "react-bootstrap"
import CampoLaudoList from "@/hooks/useCampoLaudoList"
import EstagiarioList from "@/hooks/useEstagiarioList"
import FotosList from "@/hooks/useFotoList"
import LaudoMicroscopiaList from "@/hooks/useLaudoMicroscopiaList"
import { getToken, getRoles } from "../../../../services/userService"

function UpdateLaudoForm() {
  const router = useRouter()
  const { id } = router.query

  const [laudo, setLaudo] = useState({
    id: 0,
    conclusao: "",
    fichaSolicitacaoServico: { id: null },
    campoLaudo: [],
    campoMicroscopia: [],
  })

  const [errors, setErrors] = useState({})
  const [showAlert, setShowAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [loading, setLoading] = useState(true)

  const [filteredFichas, setFilteredFichas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchError, setSearchError] = useState(false)
  const [selectedFicha, setSelectedFicha] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const { fichas, error: fichasError } = FichaSolicitacaoServicoList()
  const { campoLaudo, error: campoLaudoError } = CampoLaudoList()
  const { campoMicroscopiaOptions, error: microscopiaError } = LaudoMicroscopiaList()
  const { estagiarios = [], error: estagiariosError } = EstagiarioList()
  const { fotos = [], error: fotosError } = FotosList()

  const [selectedEstagiarioId, setSelectedEstagiarioId] = useState("")
  const [selectedFotoId, setSelectedFotoId] = useState("")

  const roles = getRoles()
  const token = getToken()

  useEffect(() => {
    const loadLaudo = async () => {
      if (!id) return

      try {
        const laudoData = await getLaudoNecropsiaById(id)

        setLaudo({
          id: laudoData.id,
          conclusao: laudoData.conclusao || "",
          fichaSolicitacaoServico: { id: laudoData.fichaSolicitacaoServico?.id || null },
          campoLaudo: laudoData.campoLaudo || [],
          campoMicroscopia: laudoData.campoMicroscopia || [],
        })

        if (laudoData.fichaSolicitacaoServico?.codigoPatologia) {
          setSearchTerm(laudoData.fichaSolicitacaoServico.codigoPatologia)
        }

        if (laudoData.estagiario && laudoData.estagiario.length > 0) {
          setSelectedEstagiarioId(laudoData.estagiario[0].id.toString())
        }

        if (laudoData.foto && laudoData.foto.length > 0) {
          setSelectedFotoId(laudoData.foto[0].id.toString())
        }

        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar laudo:", error)
        setShowErrorAlert(true)
        setLoading(false)
      }
    }

    loadLaudo()
  }, [id])

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    )
  }

  if (!roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Carregando...</h3>
      </div>
    )
  }

  const handleCampoLaudoChange = (event, index) => {
    const selectedCampoId = Number.parseInt(event.target.value)
    const selectedCampo = campoLaudo.find((campo) => campo.id === selectedCampoId)

    if (selectedCampo) {
      setLaudo((prevData) => {
        const newCampoLaudo = [...prevData.campoLaudo]
        newCampoLaudo[index] = { id: selectedCampo.id }
        return { ...prevData, campoLaudo: newCampoLaudo }
      })
    }
  }

  const addCampoLaudoField = () => {
    setLaudo((prevData) => ({
      ...prevData,
      campoLaudo: [...prevData.campoLaudo, { id: "" }],
    }))
  }

  const removeCampoLaudoField = (index) => {
    setLaudo((prevData) => ({
      ...prevData,
      campoLaudo: prevData.campoLaudo.filter((_, i) => i !== index),
    }))
  }

  const handleMicroscopiaChange = (event, index) => {
    const selectedMicroscopiaId = Number.parseInt(event.target.value)
    setLaudo((prevData) => {
      const newCampoMicroscopia = [...prevData.campoMicroscopia]
      newCampoMicroscopia[index] = { id: selectedMicroscopiaId }
      return { ...prevData, campoMicroscopia: newCampoMicroscopia }
    })
  }

  const addMicroscopiaField = () => {
    setLaudo((prevData) => ({
      ...prevData,
      campoMicroscopia: [...prevData.campoMicroscopia, { id: "" }],
    }))
  }

  const removeMicroscopiaField = (index) => {
    setLaudo((prevData) => ({
      ...prevData,
      campoMicroscopia: prevData.campoMicroscopia.filter((_, i) => i !== index),
    }))
  }

  const handleEstagiarioChange = (event) => {
    const estagiarioId = event.target.value
    setSelectedEstagiarioId(estagiarioId)

    setLaudo((prevData) => ({
      ...prevData,
      estagiario: [{ id: Number.parseInt(estagiarioId) }],
    }))
  }

  const handleFotoChange = (event) => {
    const fotoId = event.target.value
    setSelectedFotoId(fotoId)

    setLaudo((prevData) => ({
      ...prevData,
      foto: [{ id: Number.parseInt(fotoId) }],
    }))
  }

  const handleLaudoChange = (event) => {
    const { name, value } = event.target
    setLaudo((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleLaudoUpdate = async () => {
    const laudoToSend = {
      conclusao: laudo.conclusao,
      fichaSolicitacaoServico: { id: laudo.fichaSolicitacaoServico.id },
      campoLaudo: laudo.campoLaudo.map((campo) => ({ id: campo.id })),
      estagiario: selectedEstagiarioId ? [{ id: Number.parseInt(selectedEstagiarioId) }] : [],
      foto: selectedFotoId ? [{ id: Number.parseInt(selectedFotoId) }] : [],
      campoMicroscopia: laudo.campoMicroscopia.map((microscopia) => ({ id: microscopia.id })),
    }

    console.log("laudoToSend:", laudoToSend)
    try {
      await updateLaudoNecropsia(id, laudoToSend)
      setShowAlert(true)
      setTimeout(() => {
        router.push(`/lapa/getLaudoById/${id}`)
      }, 2000)
    } catch (error) {
      console.error("Erro ao atualizar laudo de necropsia:", error)
      setShowErrorAlert(true)
    }
  }

  const handleSearch = (event) => {
    const term = event.target.value
    setSearchTerm(term)

    if (term) {
      const filtered = fichas.filter(
        (ficha) =>
          ficha.id.toString().includes(term) ||
          (ficha.codigoPatologia && ficha.codigoPatologia.toLowerCase().includes(term.toLowerCase())),
      )
      setFilteredFichas(filtered)
      setSearchError(filtered.length === 0)
    } else {
      setFilteredFichas([])
      setSearchError(true)
    }
  }

  const handleFichaSelection = (ficha) => {
    if (!ficha || !ficha.id) {
      console.error("Ficha inválida:", ficha)
      return
    }

    setLaudo((prevData) => ({
      ...prevData,
      fichaSolicitacaoServico: { id: ficha.id },
    }))

    setShowModal(false)
    setSearchTerm(ficha.codigoPatologia)
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Editar Laudo</h1>
      <div className={styles.form_box}>
        <div className={styles.inputs_container}>
          <div className={styles.inputs_box}>
            <div className={`col ${styles.col}`}>
              <label htmlFor="search" className="form-label">
                Pesquisar Ficha de Solicitação
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className={`form-control ${searchError ? "is-invalid" : ""}`}
                  id="search"
                  placeholder="Digite o Código Patologia"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowModal(true)}>
                  Buscar
                </button>
              </div>
              {searchError && <div className="invalid-feedback">Por favor, digite um termo de pesquisa válido.</div>}
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="campoLaudo" className={`form-label ${styles.macroscopia_label}`}>
                Macroscopia
              </label>
              {laudo.campoLaudo.map((campo, index) => (
                <div className={styles.macroscopia_field} key={index}>
                  <select
                    id={`campoLaudo-${index}`}
                    className={`form-select ${styles.macroscopia_select}`}
                    value={campo.id}
                    onChange={(e) => handleCampoLaudoChange(e, index)}
                  >
                    <option disabled value="">
                      Selecione a Macroscopia
                    </option>
                    {campoLaudo.map((campo) => (
                      <option key={campo.id} value={campo.id}>
                        {campo.descricao}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={`btn btn-danger ${styles.macroscopia_button}`}
                    onClick={() => removeCampoLaudoField(index)}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <div className={styles.add_button_container}>
                <button type="button" className={`btn ${styles.add_button}`} onClick={addCampoLaudoField}>
                  Adicionar Macroscopia
                </button>
              </div>
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="estagiario" className="form-label">
                Estagiário
              </label>
              <select
                id="estagiario"
                className="form-select"
                value={selectedEstagiarioId}
                onChange={handleEstagiarioChange}
              >
                <option value="">Selecione o Estagiário</option>
                {estagiarios.map((estagiario) => (
                  <option key={estagiario.id} value={estagiario.id}>
                    {estagiario.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="foto" className="form-label">
                Foto
              </label>
              <select id="foto" className="form-select" value={selectedFotoId} onChange={handleFotoChange}>
                <option value="" disabled>
                  Selecione a Foto
                </option>
                {fotos.map((foto) => (
                  <option key={foto.id} value={foto.id}>
                    {foto.titulo}
                  </option>
                ))}
              </select>
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="campoMicroscopia" className={`form-label ${styles.macroscopia_label}`}>
                Microscopia
              </label>
              {laudo.campoMicroscopia.map((microscopia, index) => (
                <div className={styles.macroscopia_field} key={index}>
                  <select
                    id={`campoMicroscopia-${index}`}
                    className={`form-select ${styles.macroscopia_select}`}
                    value={microscopia.id}
                    onChange={(e) => handleMicroscopiaChange(e, index)}
                  >
                    <option disabled value="">
                      Selecione a Microscopia
                    </option>
                    {campoMicroscopiaOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.descricao} {option.orgao ? `(${option.orgao.nome})` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={`btn btn-danger ${styles.macroscopia_button}`}
                    onClick={() => removeMicroscopiaField(index)}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <div className={styles.add_button_container}>
                <button type="button" className={`btn ${styles.add_button}`} onClick={addMicroscopiaField}>
                  Adicionar Microscopia
                </button>
              </div>
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="conclusao" className="form-label">
                Conclusão
              </label>
              <textarea
                className={`form-control ${styles.input} ${errors.conclusao ? "is-invalid" : ""}`}
                name="conclusao"
                value={laudo.conclusao}
                onChange={handleLaudoChange}
              />
            </div>
          </div>
          <div className={styles.button_box}>
            <CancelarWhiteButton />
            <button type="button" className={styles.cadastrar_button} onClick={handleLaudoUpdate}>
              Atualizar Laudo
            </button>
          </div>
        </div>
      </div>
      {showAlert && <Alert message="Laudo de necropsia atualizado com sucesso!" show={showAlert} />}
      {showErrorAlert && (
        <ErrorAlert message="Erro ao atualizar laudo de necropsia, tente novamente." show={showErrorAlert} />
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecionar Ficha de Solicitação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filteredFichas.length > 0 ? (
            filteredFichas.map((ficha) => (
              <div key={ficha.id} className={styles.term} onClick={() => handleFichaSelection(ficha)}>
                {ficha.codigoPatologia}
              </div>
            ))
          ) : (
            <p>Nenhuma ficha encontrada.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UpdateLaudoForm
