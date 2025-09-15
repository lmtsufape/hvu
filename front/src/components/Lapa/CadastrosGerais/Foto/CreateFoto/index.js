"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "./index.module.css"
import VoltarButton from "../../../VoltarButton"
import { CancelarWhiteButton } from "../../../../WhiteButton"
import { uploadFoto } from "../../../../../../services/fotoService"
import Alert from "../../../../Alert"
import ErrorAlert from "../../../../ErrorAlert"
import { getToken, getRoles } from "../../../../../../services/userService"

function CreateFoto() {
  const router = useRouter()

  const [showAlert, setShowAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errors, setErrors] = useState({})
  const [titulo, setTitulo] = useState("")
  const [foto, setFoto] = useState(null)
  const roles = getRoles()
  const token = getToken()

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

  const handleFileChange = (event) => {
    setFoto(event.target.files[0])
  }

  const validateForm = () => {
    const errors = {}
    if (!titulo) {
      errors.titulo = "Campo obrigatório"
    }
    if (!foto) {
      errors.foto = "Campo obrigatório"
    }
    return errors
  }

  const handleSubmit = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      await uploadFoto(foto, titulo)
      setShowAlert(true)
      setTitulo("")
      setFoto(null)
    } catch (error) {
      console.error("Erro ao criar foto:", error)
      setShowErrorAlert(true)
    }
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Adicionar Foto</h1>
      <form className={styles.inputs_container}>
        <div className={styles.inputs_box}>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="titulo" className="form-label">
                Título <span className={styles.obrigatorio}>*</span>
              </label>
              <input
                type="text"
                placeholder="Digite o título da foto"
                className={`form-control ${styles.input} ${errors.titulo ? "is-invalid" : ""}`}
                name="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              {errors.titulo && <div className={`invalid-feedback ${styles.error_message}`}>{errors.titulo}</div>}
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="foto" className="form-label">
                Foto <span className={styles.obrigatorio}>*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className={`form-control ${styles.input} ${errors.foto ? "is-invalid" : ""}`}
                onChange={handleFileChange}
              />
              {errors.foto && <div className={`invalid-feedback ${styles.error_message}`}>{errors.foto}</div>}
            </div>
          </div>
        </div>
        <div className={styles.button_box}>
          <CancelarWhiteButton />
          <button type="button" className={styles.criar_button} onClick={handleSubmit}>
            Criar
          </button>
        </div>
      </form>
      {showAlert && <Alert message="Foto criada com sucesso!" show={showAlert} url={`/lapa/gerenciarFotos`} />}
      {showErrorAlert && <ErrorAlert message="Erro ao criar foto, tente novamente." show={showErrorAlert} />}
    </div>
  )
}

export default CreateFoto
