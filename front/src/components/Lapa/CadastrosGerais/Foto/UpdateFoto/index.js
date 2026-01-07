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
  const [showFileSizeAlert, setShowFileSizeAlert] = useState(false) // Novo estado para alerta de tamanho
  const [foto, setFoto] = useState({})
  const [fotoFile, setFotoFile] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)

  const [token, setToken] = useState(null)
  const [roles, setRoles] = useState([])

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 

  useEffect(() => {
    setToken(getToken())
    setRoles(getRoles())
  }, [])

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
    const file = event.target.files[0]
    
    if (!file) {
      setFotoFile(null)
      return
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setShowFileSizeAlert(true)
      
      setErrors((prev) => ({
        ...prev,
        fotoFile: `Arquivo muito grande! Tamanho máximo permitido: 5MB. Seu arquivo: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      }))
      
      event.target.value = ""
      setFotoFile(null)
      return
    }
    
    setShowFileSizeAlert(false)
    setErrors((prev) => ({ ...prev, fotoFile: "" }))
    setFotoFile(file)
  }

  const validateForm = () => {
    const errors = {}
    if (!foto.titulo?.trim()) errors.titulo = "Campo obrigatório"
    return errors
  }

  const handleFotoUpdate = async () => {
    if (fotoFile && fotoFile.size > MAX_FILE_SIZE) {
      setShowFileSizeAlert(true)
      setErrors((prev) => ({
        ...prev,
        fotoFile: `Arquivo muito grande! Tamanho máximo: 5MB. Seu arquivo: ${(fotoFile.size / (1024 * 1024)).toFixed(2)}MB`
      }))
      return
    }

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      await replaceFoto(id, fotoFile, foto.titulo)
      setShowAlert(true)
      setErrors({})
      setShowFileSizeAlert(false)
    } catch (error) {
      console.error("Erro ao editar foto:", error)

      if (error.response?.status === 400) {
        setErrors((prev) => ({
          ...prev,
          fotoFile: "Arquivo muito grande! Tamanho máximo permitido: 5MB."
        }))
        setShowFileSizeAlert(true)
        setShowErrorAlert(false)
        return
      }

      setShowErrorAlert(true)
      setShowFileSizeAlert(false)
    }
  }

  const handleCloseFileSizeAlert = () => {
    setShowFileSizeAlert(false)
    setErrors((prev) => ({ ...prev, fotoFile: "" }))
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
              <label htmlFor="titulo" className="form-label">Título</label>
              <input
                type="text"
                className={`form-control ${styles.input} ${errors.titulo ? "is-invalid" : ""}`}
                name="titulo"
                value={foto.titulo || ""}
                onChange={handleFotoChange}
              />
              <div
                className={`invalid-feedback ${styles.error_message}`}
                style={{ display: errors.titulo ? "block" : "none" }}
              >
                {errors.titulo || ""}
              </div>
            </div>
          </div>

          <div className={`col ${styles.col}`}>
            <label htmlFor="foto" className="form-label">Nova Foto (opcional)</label>
            <input
              type="file"
              className={`form-control ${styles.input} ${errors.fotoFile ? "is-invalid" : ""}`}
              accept="image/*"
              onChange={handleFileChange}
            />

            <div
              className={`invalid-feedback ${styles.error_message}`}
              style={{ 
                display: errors.fotoFile ? "block" : "none",
                marginTop: "5px"
              }}
            >
              {errors.fotoFile || ""}
            </div>
            
            <div className="form-text" style={{ marginTop: "5px" }}>
              <small>
                Tamanho máximo: <strong>5MB</strong>. Deixe em branco para manter a imagem atual.
              </small>
            </div>
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
          onClose={() => setShowErrorAlert(false)}
        />
      )}

      {showFileSizeAlert && (
        <ErrorAlert
          message={
            errors.fotoFile || 
            "Arquivo muito grande! O tamanho máximo permitido é 5MB. Por favor, selecione uma imagem menor."
          }
          show={showFileSizeAlert}
          onClose={handleCloseFileSizeAlert}
        />
      )}
    </div>
  )
}

export default UpdateFoto