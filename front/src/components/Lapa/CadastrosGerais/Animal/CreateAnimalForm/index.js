"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "./index.module.css"
import { createAnimalByPatologista } from "../../../../../../services/animalService"
import EspeciesList from "@/hooks/useEspecieList"
import RacasList from "@/hooks/useRacaList"
import VoltarButton from "@/components/Lapa/VoltarButton"
import Alert from "@/components/Alert"
import ErrorAlert from "@/components/ErrorAlert"
import CreateTutorForm from "../../../../CreateTutorEnderecoForm/createTutorForm"
import CreateEnderecoForm from "../../../../CreateTutorEnderecoForm/createEnderecoForm"
import TutorSelector from "../../../TutorSelector"

function CreateAnimalForm() {
  const router = useRouter()
  const { tipo } = router.query

  const { especies, error: especiesError } = EspeciesList()
  const { racas, error: racasError } = RacasList()

  const [selectedEspecie, setSelectedEspecie] = useState(null)
  const [selectedRaca, setSelectedRaca] = useState(null)

  const [racasByEspecie, setRacasByEspecie] = useState([])
  const [isRacaSelectDisabled, setIsRacaSelectDisabled] = useState(true)
  const [especieName, setEspecieName] = useState("")

  const [showAlert, setShowAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const [laiChecked, setLaiChecked] = useState(false)

  const [showTutorSelector, setShowTutorSelector] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)

  const [animalData, setAnimalData] = useState({
    nome: "",
    sexo: "",
    alergias: "",
    dataNascimento: "",
    imagem: "",
    obito: false,
    raca: { id: null },
  })

  const [tutorData, setTutorData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })

  const [enderecoData, setEnderecoData] = useState({
    cep: "",
    rua: "",
    estado: "",
    cidade: "",
    numero: "",
    bairro: "",
  })

  const [errors, setErrors] = useState({
    nome: "",
    dataNascimento: "",
    sexo: "",
    especie: "",
    raca: "",
    tutorNome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cep: "",
    rua: "",
    estado: "",
    cidade: "",
    numero: "",
    bairro: "",
    lai: "",
  })

  useEffect(() => {
    if (tipo === "existente" && !selectedTutor) {
      setShowTutorSelector(true)
    } else {
      setShowTutorSelector(false)
    }
  }, [tipo, selectedTutor])

  useEffect(() => {
    if (especies.length > 0 && selectedEspecie === null) {
      setSelectedEspecie(null)
      setSelectedRaca(null)
    }
    if (racas.length > 0 && selectedRaca === null) {
      setSelectedRaca(null)
    }
  }, [especies, racas, selectedEspecie, selectedRaca])

  const handleTutorSelect = (tutor) => {
    setSelectedTutor(tutor)
    setShowTutorSelector(false)
  }

  const handleBackToTutorSelection = () => {
    setSelectedTutor(null)
    setShowTutorSelector(true)
  }

  const formatDate = (data) => {
    if (!data) return "" // Retorna vazio se não houver data
    const dataObj = new Date(data)
    const dia = String(dataObj.getUTCDate()).padStart(2, "0")
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0")
    const ano = dataObj.getUTCFullYear()
    return `${ano}-${mes}-${dia}`
  }

  const handleAnimalChange = (event) => {
    const { name, value, type, checked } = event.target
    setAnimalData({
      ...animalData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleTutorChange = (event) => {
    const { name, value } = event.target
    setTutorData({ ...tutorData, [name]: value })
  }

  const handleEnderecoChange = (event) => {
    const { name, value } = event.target
    setEnderecoData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCheckboxChange = (event) => {
    setLaiChecked(event.target.checked)
  }

  const handleEspecieSelection = (event) => {
    const selectedEspecieId = event.target.value
    setSelectedEspecie(selectedEspecieId)
    setSelectedRaca(null)

    const racasFiltradas = racas.filter((r) => r.especie.id === Number.parseInt(selectedEspecieId))
    setRacasByEspecie(racasFiltradas)

    setIsRacaSelectDisabled(false)
  }

  const handleRacaSelection = (event) => {
    const selectedRacaId = event.target.value
    const selectedRacaObj = racas.find((r) => r.id === Number.parseInt(selectedRacaId))
    setSelectedRaca(selectedRacaObj.id)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!animalData.nome) {
      newErrors.nome = "Campo obrigatório"
    }

    if (!animalData.sexo) {
      newErrors.sexo = "Campo obrigatório"
    }
    if (!selectedEspecie) {
      newErrors.especie = "Campo obrigatório"
    }
    if (!selectedEspecie && !selectedRaca) {
      newErrors.raca = "Selecione uma espécie"
    }
    if (selectedEspecie && !selectedRaca) {
      newErrors.raca = "Campo obrigatório"
    }

    if (tipo === "novo") {
      // Tutor validations
      if (!tutorData.nome) {
        newErrors.tutorNome = "Nome é obrigatório"
      } else if (tutorData.nome.trim().split(" ").length < 2) {
        newErrors.tutorNome = "Digite seu nome completo"
      }

      if (!tutorData.email) {
        newErrors.email = "E-mail é obrigatório"
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tutorData.email)) {
        newErrors.email = "E-mail inválido"
      }

      if (!tutorData.senha) {
        newErrors.senha = "Senha é obrigatória"
      }

      if (!tutorData.confirmarSenha) {
        newErrors.confirmarSenha = "Confirme sua senha"
      } else if (tutorData.senha !== tutorData.confirmarSenha) {
        newErrors.confirmarSenha = "As senhas não coincidem"
      }

      // CPF validation
      const cpfLimpo = tutorData.cpf.replace(/\D/g, "")
      if (!cpfLimpo || cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
        newErrors.cpf = "CPF inválido"
      }

      if (!tutorData.telefone) {
        newErrors.telefone = "Telefone é obrigatório"
      }

      // Endereco validations
      if (!enderecoData.rua) {
        newErrors.rua = "Rua é obrigatório"
      }
      if (!enderecoData.bairro) {
        newErrors.bairro = "Bairro é obrigatório"
      }
      if (!enderecoData.numero) {
        newErrors.numero = "Número é obrigatório"
      }
      if (!enderecoData.cep) {
        newErrors.cep = "CEP é obrigatório"
      } else if (!/^\d{5}-?\d{3}$/.test(enderecoData.cep)) {
        newErrors.cep = "CEP inválido"
      }
      if (!enderecoData.estado) {
        newErrors.estado = "Estado é obrigatório"
      }
      if (!enderecoData.cidade) {
        newErrors.cidade = "Cidade é obrigatório"
      }
      if (!laiChecked) {
        newErrors.lai = "É necessário concordar com o termo acima!"
      }
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === "")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (validateForm()) {
      if (especies.length > 0 && racas.length > 0) {
        let requestData = {}

        const animalToCreate = {
          nome: animalData.nome,
          sexo: animalData.sexo === "macho" ? "Macho" : "Fêmea",
          alergias: animalData.alergias,
          dataNascimento: formatDate(animalData.dataNascimento),
          obito: animalData.obito,
          raca: selectedRaca ? { id: Number.parseInt(selectedRaca) } : null,
        }

        if (tipo === "anonimo") {
          requestData = {
            animal: animalToCreate,
            tutor: {
              anonimo: true,
            },
          }
        } else if (tipo === "novo") {
          requestData = {
            animal: animalToCreate,
            tutor: {
              anonimo: false,
              cpf: tutorData.cpf,
              telefone: tutorData.telefone,
              nome: tutorData.nome,
              email: tutorData.email,
              senha: tutorData.senha,
              endereco: {
                cep: enderecoData.cep,
                rua: enderecoData.rua,
                estado: enderecoData.estado,
                cidade: enderecoData.cidade,
                numero: Number.parseInt(enderecoData.numero),
                bairro: enderecoData.bairro,
              },
            },
          }
        } else if (tipo === "existente") {
          if (!selectedTutor) {
            console.error("Nenhum tutor selecionado")
            return
          }

          requestData = {
            animal: animalToCreate,
            tutorId: selectedTutor.id,
          }
        }

        try {
          const result = await createAnimalByPatologista(requestData)
          console.log(result)
          //resetForm()
          setShowAlert(true)
        } catch (error) {
          console.error("Erro ao criar animal:", error)
          console.log("Detalhes do erro:", error.response)
          //resetForm()
          setShowErrorAlert(true)
        }
      } else {
        console.log("Aguardando dados de espécies e raças carregarem...")
      }
    } else {
      console.log("Formulário inválido, preencha corretamente e tente novamente.")
    }
  }

  const resetForm = () => {
    setAnimalData({
      nome: "",
      sexo: "",
      alergias: "",
      dataNascimento: "",
      imagem: "NULL",
      obito: false,
    })
    setTutorData({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    })
    setEnderecoData({
      cep: "",
      rua: "",
      estado: "",
      cidade: "",
      numero: "",
      bairro: "",
    })
    setLaiChecked(false)
    setSelectedEspecie(especies.length > 0 ? especies[0]?.id.toString() : "")
    setSelectedRaca(racas.length > 0 ? racas[0]?.id.toString() : "")
    setRacasByEspecie([])
    setIsRacaSelectDisabled(true)
    setErrors({
      nome: "",
      dataNascimento: "",
      sexo: "",
      alergias: "",
      especie: "",
      raca: "",
      tutorNome: "",
      cpf: "",
      telefone: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      cep: "",
      rua: "",
      estado: "",
      cidade: "",
      numero: "",
      bairro: "",
      lai: "",
    })
  }

  const getTitulo = () => {
    switch (tipo) {
      case "anonimo":
        return "Cadastrar animal - Tutor Anônimo"
      case "novo":
        return "Cadastrar animal - Novo Tutor"
      case "existente":
        return "Cadastrar animal - Tutor Existente"
      default:
        return "Cadastrar animal"
    }
  }

  if (showTutorSelector) {
    return <TutorSelector onTutorSelect={handleTutorSelect} onBack={() => router.back()} />
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>{getTitulo()}</h1>

      {tipo === "existente" && selectedTutor && (
        <div className={styles.selectedTutorInfo}>
          <h4>Tutor Selecionado:</h4>
          <div className={styles.tutorDetails}>
            <p>
              <strong>Nome:</strong> {selectedTutor.nome}
            </p>
            <p>
              <strong>CPF:</strong> {selectedTutor.cpf}
            </p>
            {selectedTutor.telefone && (
              <p>
                <strong>Telefone:</strong> {selectedTutor.telefone}
              </p>
            )}
            {selectedTutor.email && (
              <p>
                <strong>Email:</strong> {selectedTutor.email}
              </p>
            )}
            <button onClick={handleBackToTutorSelection} className={styles.changeTutorButton}>
              Alterar Tutor
            </button>
          </div>
        </div>
      )}

      <form className={styles.form_box} onSubmit={handleSubmit}>
        <div className="row">
          <div className={`col ${styles.col}`}>
            <label htmlFor="nome" className="form-label">
              Nome <span className={styles.obrigatorio}>*</span>
            </label>
            <input
              type="text"
              className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
              name="nome"
              placeholder="Digite o nome do animal"
              value={animalData.nome}
              onChange={handleAnimalChange}
            />
            {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
          </div>
          <div className={`col ${styles.col}`}>
            <label htmlFor="nascimento" className="form-label">
              Data de Nascimento
            </label>
            <input
              type="date"
              className={`form-control ${styles.input}`}
              name="dataNascimento"
              value={animalData.dataNascimento || ""}
              onChange={handleAnimalChange}
            />
          </div>
        </div>

        <div className="row">
          <div className={`col ${styles.col}`}>
            <label htmlFor="especie" className="form-label">
              Espécie <span className={styles.obrigatorio}>*</span>
            </label>
            <select
              className={`form-select ${styles.input} ${errors.especie ? "is-invalid" : ""}`}
              name="especie"
              aria-label="Selecione a espécie do animal"
              value={selectedEspecie || ""}
              onChange={handleEspecieSelection}
            >
              <option value="">Selecione a espécie</option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nome}
                </option>
              ))}
            </select>
            {errors.especie && <div className={`invalid-feedback ${styles.error_message}`}>{errors.especie}</div>}
          </div>

          <div className={`col ${styles.col}`}>
            <label htmlFor="raca" className="form-label">
              Raça {selectedEspecie && <span className={styles.obrigatorio}>*</span>}
            </label>
            <select
              className={`form-select ${styles.input} ${errors.raca ? "is-invalid" : ""}`}
              name="raca"
              aria-label="Selecione a raça do animal"
              value={selectedRaca || ""}
              onChange={handleRacaSelection}
              disabled={!selectedEspecie}
            >
              <option value="">Selecione a raça</option>
              {racasByEspecie.map((raca) => (
                <option key={raca.id} value={raca.id}>
                  {raca.nome}
                </option>
              ))}
            </select>
            {errors.raca && <div className={`invalid-feedback ${styles.error_message}`}>{errors.raca}</div>}
          </div>
        </div>

        <div className="row">
          <div className={`col ${styles.col}`}>
            <label htmlFor="alergias" className="form-label">
              Alergias
            </label>
            <input
              type="text"
              className={`form-control ${styles.input}`}
              name="alergias"
              placeholder="Digite as alergias, se houver"
              value={animalData.alergias}
              onChange={handleAnimalChange}
            />
          </div>

          <div className={`col ${styles.col}`}>
            <label htmlFor="sexo" className="form-label">
              Sexo <span className={styles.obrigatorio}>*</span>
            </label>
            <select
              className={`form-select ${styles.input} ${errors.sexo ? "is-invalid" : ""}`}
              name="sexo"
              aria-label="Selecione o sexo do animal"
              value={animalData.sexo}
              onChange={handleAnimalChange}
            >
              <option value="">Selecione o sexo do animal</option>
              <option value="macho">Macho</option>
              <option value="femea">Fêmea</option>
            </select>
            {errors.sexo && <div className={`invalid-feedback ${styles.error_message}`}>{errors.sexo}</div>}
          </div>
        </div>

        <div className="row">
          <div className={`col ${styles.col}`}>
            <label className="form-label">
              <input
                type="checkbox"
                name="obito"
                checked={animalData.obito}
                onChange={handleAnimalChange}
                className="me-2"
              />
              Óbito
            </label>
          </div>
        </div>

        {tipo === "novo" && (
          <>
            <hr className="my-4" />
            <h4>Dados do Tutor</h4>

            <CreateTutorForm tutorFormData={tutorData} handleTutorChange={handleTutorChange} errors={errors} />

            <CreateEnderecoForm
              enderecoFormData={enderecoData}
              handleEnderecoChange={handleEnderecoChange}
              errors={errors}
              laiChecked={laiChecked}
              handleCheckboxChange={handleCheckboxChange}
            />
          </>
        )}

        <div className={styles.button_container}>
          <button className={styles.cadastrar_button} type="submit">
            Cadastrar
          </button>
        </div>
      </form>
      {<Alert message="Animal cadastrado com sucesso!" show={showAlert} url="/lapa/gerenciarAnimais" />}
      {showErrorAlert && <ErrorAlert message="Erro ao realizar cadastro, tente novamente." show={showErrorAlert} />}
    </div>
  )
}

export default CreateAnimalForm
