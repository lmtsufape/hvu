"use client"

import { useState, useEffect } from "react"
import styles from "./index.module.css"
import useTutorList from "../../../hooks/useTutorList"

function TutorSelector({ onTutorSelect, onBack }) {
  const { tutores, error: hookError } = useTutorList()
  const [filteredTutores, setFilteredTutores] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tutores.length > 0 || hookError) {
      setLoading(false)
    }
  }, [tutores, hookError])

  useEffect(() => {
    filterTutores()
  }, [searchTerm, tutores])

  const filterTutores = () => {
    if (!searchTerm) {
      setFilteredTutores(tutores)
      return
    }

    const filtered = tutores.filter(
      (tutor) =>
        tutor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.cpf?.includes(searchTerm) ||
        tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.telefone?.includes(searchTerm),
    )
    setFilteredTutores(filtered)
  }

  const handleTutorSelect = (tutor) => {
    onTutorSelect(tutor)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando tutores...</p>
      </div>
    )
  }

  if (hookError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Erro ao carregar tutores</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Selecionar Tutor Existente</h1>
          <p className={styles.subtitle}>Escolha um tutor para vincular ao novo animal</p>
        </div>
        <button onClick={onBack} className={styles.backButton}>
          Voltar
        </button>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por nome, CPF, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredTutores.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{searchTerm ? "Nenhum tutor encontrado com os critérios de busca" : "Nenhum tutor cadastrado"}</p>
        </div>
      ) : (
        <div className={styles.tutorGrid}>
          {filteredTutores.map((tutor) => (
            <div key={tutor.id} className={styles.tutorCard}>
              <div className={styles.tutorHeader}>
                <h3 className={styles.tutorName}>{tutor.nome}</h3>
              </div>
              <div className={styles.tutorInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>CPF:</span>
                  <span>{tutor.cpf}</span>
                </div>
                {tutor.telefone && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Telefone:</span>
                    <span>{tutor.telefone}</span>
                  </div>
                )}
                {tutor.email && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span>{tutor.email}</span>
                  </div>
                )}
                <button onClick={() => handleTutorSelect(tutor)} className={styles.selectButton}>
                  Selecionar Tutor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TutorSelector
