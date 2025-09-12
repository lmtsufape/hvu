import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { getAnimalById, updateAnimal } from '../../../services/animalService';  
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";
import VoltarButton from '../VoltarButton';
import { CancelarWhiteButton } from '../WhiteButton';
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";
import { getCurrentUsuario } from '../../../services/userService';

function UpdateAnimalBySecretarioAndMedico() {
  const router = useRouter();
  const { id } = router.query;

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [errors, setErrors] = useState({});

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedRaca, setSelectedRaca] = useState(null);

  const [racasByEspecie, setRacasByEspecie] = useState([]);

  const [animalData, setAnimalData] = useState({ });

  const [url, setUrl] = useState('');

  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedRoles = JSON.parse(localStorage.getItem('roles'));
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const animal = await getAnimalById(id);
          setAnimalData(animal);

          // Definir espécie e raça selecionadas inicialmente
          setSelectedEspecie(animal.raca.especie.id.toString()); // Convertendo para string
          setSelectedRaca(animal.raca.id.toString()); // Convertendo para string
        } catch (error) {
          console.error('Erro ao buscar animal:', error);
        } finally {
          setLoading(false); // Marcar como carregado após buscar os dados
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    // Atualizar raças correspondentes à espécie inicial
    const racasFiltradas = racas.filter((r) => r.especie.id.toString() === selectedEspecie);
    setRacasByEspecie(racasFiltradas);
  }, [selectedEspecie, racas]);

  const loadUrl = async () => {
    try {
      const userData = await getCurrentUsuario();

      console.log("user:", userData)

      if (userData.roles && Array.isArray(userData.roles)) {
          if (userData.roles.includes("secretario")) {
            setUrl('/pacientesBySecretario');
          } else if (userData.roles.includes("medico")) {
            setUrl(`/getAnimalByIdByMedico/${id}`);
          }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (data) => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getUTCDate()).padStart(2, '0');
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
    const ano = dataObj.getUTCFullYear();
    return `${ano}-${mes}-${dia}`;
  }; 

  const handleAnimalChange = (event) => {
    try {
      const { name, value } = event.target;
      setAnimalData({ ...animalData, [name]: value });
    } catch (error) {
      console.error('Erro ao puxar dados do animal:', error);
    }
  };

  const handleEspecieSelection = (event) => {
    try {
      const selectedEspecieId = event.target.value;

      setSelectedEspecie(selectedEspecieId);

      // Reiniciar a raça selecionada quando a espécie é alterada
      setSelectedRaca(""); // Você pode ajustar isso conforme necessário
    } catch (error) {
      console.error('Erro ao selecionar espécie:', error);
    }
  };

  const handleRacaSelection = (event) => {
    try {
      const selectedRacaId = event.target.value;
      setSelectedRaca(selectedRacaId); // Ajuste aqui
    } catch (error) {
      console.error('Erro ao selecionar raça:', error);
    }
  };

  
    // Verifica se os dados estão carregando
    if (loading) {
      return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  // Verifica se o usuário tem permissão
  if (roles.includes("tutor")) {
      return (
          <div className={styles.container}>
              <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
          </div>
      );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!animalData.nome) {
      newErrors.nome = "Campo obrigatório";
    }
    
    if (!animalData.sexo) {
      newErrors.sexo = "Campo obrigatório";
    }
    if (!selectedEspecie) {
      newErrors.especie = "Campo obrigatório";
    }
    if (!selectedEspecie && !selectedRaca) {
      newErrors.raca = "Selecione uma espécie";
    }
    if (selectedEspecie && !selectedRaca) {
      newErrors.raca = "Campo obrigatório";
    }
    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleUpdateAnimal = async (event) => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    event.preventDefault();

    const animalToUpdate = {
      nome: animalData.nome,
      sexo: animalData.sexo,
      alergias: animalData.alergias,
      dataNascimento: formatDate(animalData.dataNascimento),
      imagem: animalData.imagem,
      numeroFicha: animalData.numeroFicha,
      peso: animalData.peso,
      raca: {
        id: parseInt(selectedRaca)
      }
    };

    console.log("Dados do animal a ser atualizado:", animalToUpdate);
    if(validateForm()) {
      if (id) {
        try {
          await updateAnimal(id, animalToUpdate);
          setShowAlert(true);
          loadUrl();
        } catch (error) {
          console.error('Erro ao atualizar o animal:', error);
          setShowErrorAlert(true);
        }
      }
    }
  };

  return (
    <div className={styles.page}>
    < VoltarButton />
    <div>
      <h1 className={styles.titulocadastro}>Editar informações do paciente</h1>
    </div>

    <form className={`${styles.boxcadastrotutor} ${styles.container}`} onSubmit={handleUpdateAnimal}>
      
      <ul className={styles.form_box}>
        {animalData && (
          <li key={animalData.id} className={styles.list}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="nome" className="form-label">Nome</label>
                <input
                  type="text"
                  className={`form-control ${styles.input}  ${errors.nome ? "is-invalid" : ""}`}
                  name="nome"
                  value={animalData.nome}
                  onChange={handleAnimalChange}
                 
                />
                {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
              </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="dataNascimento" className="form-label">Data de Nascimento </label>
                <input
                  type="date"
                  className={`form-control ${styles.input}`}
                  name="dataNascimento"
                  value={animalData.dataNascimento}
                  onChange={handleAnimalChange}
                />
              </div>
            </div>

            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="especie" className="form-label">Espécie</label>
                <select
                  className={`form-select ${styles.input}  ${errors.selectedEspecie ? "is-invalid" : ""}`}
                  name="especie"
                  aria-label={animalData.raca && animalData.raca.especie && animalData.raca.especie.nome}
                  value={selectedEspecie}
                  onChange={handleEspecieSelection}
                >
                  {especies.map((especie) => (
                    <option key={especie.id} value={especie.id.toString()}>
                      {especie.nome}
                    </option>
                  ))}
                </select>
                {errors.especie && <div className={`invalid-feedback ${styles.error_message}`}>{errors.especie}</div>}
              </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="raca" className="form-label">Raça</label>
                <select
                  className={`form-select ${styles.input}  ${errors.selectedRaca ? "is-invalid" : ""}`}
                  name="raca"
                  aria-label={animalData.raca && animalData.raca.nome}
                  value={selectedRaca}
                  onChange={handleRacaSelection}
                >
                  {racasByEspecie.map((raca) => (
                    <option key={raca.id} value={raca.id.toString()}>
                      {raca.nome}
                    </option>
                  ))}
                </select>
                {errors.raca && <div className={`invalid-feedback ${styles.error_message}`}>{errors.raca}</div>}
              </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="numeroFicha" className="form-label">Número da ficha</label>
                <input 
                  type="text"
                  className={`form-control ${styles.input}`}
                  name="numeroFicha"
                  value={animalData.numeroFicha}
                  onChange={handleAnimalChange}
                />
              </div>
            </div>

            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="alergias" className="form-label">Alergias</label>
                <input 
                  type="text"
                  className={`form-control ${styles.input}`}
                  name="alergias"
                  value={animalData.alergias}
                  onChange={handleAnimalChange}
                />
              </div>

              <div className={`col ${styles.col}`} style={{ position: 'relative', display: 'inline-block' }}>
                <label htmlFor="peso" className="form-label">Peso </label>
                <input 
                  type="number"
                  step={0.1}
                  pattern="\d+(\.\d{2})?"
                  min="0"
                  className={`form-control ${styles.input}`}
                  name="peso"
                  placeholder="Peso (Opcional)"
                  value={animalData.peso}
                  onChange={handleAnimalChange}
                  style={{ paddingRight: '30px' }} 
                />
                <span style={{ position: 'absolute', right: '18px', top: '-9px', bottom: '-16px', height: '0', margin: 'auto', pointerEvents: 'none'}}>kg</span>
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="sexo" className="form-label">Sexo</label>
                <select className={`form-select ${styles.input}  ${errors.sexo ? "is-invalid" : ""}`}
                  name="sexo"
                  aria-label={animalData.sexo}
                  value={animalData.sexo}
                  onChange={handleAnimalChange}
                >
                  <option value="">{animalData.sexo}</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
                {errors.sexo && <div className={`invalid-feedback ${styles.error_message}`}>{errors.sexo}</div>}
              </div>
            </div>

            <div className={styles.button_box}>
              < CancelarWhiteButton />
              <button type="submit" className={styles.criar_button}>
                Salvar
              </button>
            </div>
          </li>
        )}
      </ul>
    </form>
    {<Alert message="Informações do animal editadas com sucesso!" show={showAlert} url={`/getAnimalByIdByMedico/${id}`} />}
    {showErrorAlert && <ErrorAlert message="Erro ao editar informações do animal, tente novamente." show={showErrorAlert} />}
    </div>
  );
}

export default UpdateAnimalBySecretarioAndMedico;
