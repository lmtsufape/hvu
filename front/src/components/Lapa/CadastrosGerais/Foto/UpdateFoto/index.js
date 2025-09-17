"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from "./index.module.css"
import VoltarButton from "../../../VoltarButton"
import { CancelarWhiteButton } from "../../../../WhiteButton"
import { replaceFoto, getFotoById, getFotoInfo } from "../../../../../../services/fotoService"
import Alert from "../../../../Alert"
import ErrorAlert from "../../../../ErrorAlert"
import { getToken, getRoles } from "../../../../../../services/userService"

function UpdateFoto() {
  const router = useRouter()
  const { id } = router.query

  const [errors, setErrors] = useState({})
  const [showAlert, setShowAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [foto, setFoto] = useState({})
  const [fotoFile, setFotoFile] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)

  const [token, setToken] = useState(null)
  const [roles, setRoles] = useState([])

  // inicializa token e roles apenas uma vez
  useEffect(() => {
    setToken(getToken())
    setRoles(getRoles())
  }, [])

  // busca dados da foto quando o id, token e roles estiverem definidos
  useEffect(() => {
    if (!token || roles.length === 0) return

    if (!roles.includes("patologista")) {
      setHasAccess(false)
      setLoading(false)
      return
    }

    if (id) {
      const fetchData = async () => {
        try {
          setLoading(true)
          const fotoMetadata = await getFotoInfo(id)
          setFoto(fotoMetadata)

          const fotoBlob = await getFotoById(id)
          const imageUrl = URL.createObjectURL(fotoBlob)
          setCurrentImageUrl(imageUrl)
        } catch (error) {
          console.error("Erro ao buscar foto:", error)
          setShowErrorAlert(true)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [id, token, roles])

  useEffect(() => {
    return () => {
      if (currentImageUrl) URL.revokeObjectURL(currentImageUrl)
    }
  }, [currentImageUrl])

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Carregando...</h3>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Faça login ou verifique suas permissões para acessar esta página.
        </h3>
      </div>
    )
  }

  const handleFotoChange = (event) => {
    const { name, value } = event.target
    setFoto({ ...foto, [name]: value })
  }

  const handleFileChange = (event) => {
    setFotoFile(event.target.files[0])
  }

  const validateForm = () => {
    const errors = {}
    if (!foto.titulo) errors.titulo = "Campo obrigatório"
    return errors
  }

  const handleFotoUpdate = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      await replaceFoto(id, fotoFile, foto.titulo)
      setShowAlert(true)
    } catch (error) {
      console.error("Erro ao editar foto:", error)
      setShowErrorAlert(true)
    }
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Editar Informações da Foto</h1>
      {currentImageUrl && (
        <div className={styles.image_preview}>
          <h3>Imagem Atual:</h3>
          <img
            src={currentImageUrl || "/placeholder.svg"}
            alt="Foto atual"
            className={styles.current_image}
          />
        </div>
      )}
      <form className={styles.inputs_container}>
        <div className={styles.inputs_box}>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="titulo" className="form-label">
                Título
              </label>
              <input
                type="text"
                className={`form-control ${styles.input} ${errors.titulo ? "is-invalid" : ""}`}
                name="titulo"
                value={foto.titulo || ""}
                onChange={handleFotoChange}
              />
              {errors.titulo && (
                <div className={`invalid-feedback ${styles.error_message}`}>
                  {errors.titulo}
                </div>
              )}
            </div>
          </div>
          <div className={`col ${styles.col}`}>
            <label htmlFor="foto" className="form-label">
              Foto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
        </div>
        <div className={styles.button_box}>
          <CancelarWhiteButton />
          <button
            type="button"
            className={styles.criar_button}
            onClick={handleFotoUpdate}
          >
            Salvar
          </button>
        </div>
      </form>
      {showAlert && (
        <Alert
          message="Informações da foto editadas com sucesso!"
          show={showAlert}
          url={`/lapa/gerenciarFotos`}
        />
      )}
      {showErrorAlert && (
        <ErrorAlert
          message="Erro ao editar informações da foto, tente novamente."
          show={showErrorAlert}
        />
      )}
    </div>
  )
}

export default UpdateFoto
