"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from "./index.module.css"
import SearchBar from "../../../../SearchBar"
import { getAllFotos, getFotoById, deleteFoto } from "../../../../../../services/fotoService"
import VoltarButton from "../../../VoltarButton"
import ExcluirButton from "../../../../ExcluirButton"
import ErrorAlert from "../../../../ErrorAlert"
import { getToken, getRoles } from "../../../../../../services/userService"

function GerenciarFotos() {
  const [fotos, setFotos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [deletedFotoId, setDeletedFotoId] = useState(null)
  const router = useRouter()

  const roles = getRoles()
  const token = getToken()

useEffect(() => {
  const roles = getRoles()
  const token = getToken()

  const fetchData = async () => {
    try {
      const fotosData = await getAllFotos()

      const fotosComArquivo = await Promise.all(
        fotosData.map(async (foto) => {
          try {
            const blob = await getFotoById(foto.id)
            const imageUrl = URL.createObjectURL(blob)
            return { ...foto, imageUrl }
          } catch (error) {
            console.error(`Erro ao carregar arquivo da foto ${foto.id}:`, error)
            return { ...foto, imageUrl: "/placeholder.svg" }
          }
        }),
      )

      setFotos(fotosComArquivo)
    } catch (error) {
      console.error("Erro ao buscar fotos:", error)
    }
  }

  if (token && roles.includes("patologista")) {
    fetchData()
  }
}, [deletedFotoId]) 

  console.log(fotos)

  const handleDeleteFoto = async (fotoId) => {
    try {
      await deleteFoto(fotoId)
      setFotos(fotos.filter((foto) => foto.id !== fotoId))
      setDeletedFotoId(fotoId)
      setShowAlert(true)
    } catch (error) {
      console.error("Erro ao excluir foto:", error)
      if (error.response && error.response.status === 409) {
        setShowErrorAlert(true)
      }
    }
  }

  const filteredFotos = fotos.filter((foto) => {
    return foto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className={styles.container}>
      {!token ? (
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      ) : !roles.includes("patologista") ? (
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      ) : (
        <>
          <VoltarButton />
          <h1>Listagem de Fotos</h1>

          <div className={styles.navbar_container}>
            <SearchBar placeholder={`Buscar por título`} onSearchChange={setSearchTerm} />
            <button className={styles.adicionar_raca_button} onClick={() => router.push(`/lapa/createFoto`)}>
              Adicionar Foto
            </button>
          </div>

          {filteredFotos.length === 0 ? (
            <p className={styles.paragrafo}> Foto não encontrada.</p>
          ) : (
            <ul className={styles.list}>
              {filteredFotos.map((foto) => (
                <li key={foto.id} className={styles.info_container}>
                  <div className={styles.info_box}>
                    <h6>Título</h6>
                    <div className={styles.titulo_foto}>
                      <p>{foto.titulo}</p>
                      <img src={foto.imageUrl || "/placeholder.svg"} alt={foto.titulo} className={styles.foto_imagem} />
                    </div>
                  </div>
                  <div className={styles.button_container}>
                    <button className={styles.editar_button} onClick={() => router.push(`/lapa/updateFoto/${foto.id}`)}>
                      Editar
                    </button>
                    <ExcluirButton itemId={foto.id} onDelete={handleDeleteFoto} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {showAlert && <ErrorAlert message="Foto excluída com sucesso!" show={showAlert} />}
          {showErrorAlert && <ErrorAlert message="Esta foto não pode ser excluída." show={showErrorAlert} />}
        </>
      )}
    </div>
  )
}

export default GerenciarFotos
