import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import { CancelarWhiteButton }         from "@/components/WhiteButton";
import { ContinuarFichasGreenButton }  from "@/components/GreenButton";
import React, { useState, useEffect } from "react";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';


export default function PosAnestesia({
  formData,
  setFormData,
  handleChange,
  handleCheckboxChange,
  prevStep,
  handleSubmit
}) {
const [loading, setLoading] = useState(true);
const router = useRouter();
const [consultaId, setConsultaId] = useState(null);
const [animalId, setAnimalId] = useState(null);
const [animal, setAnimal] = useState({});
const [showButtons, setShowButtons] = useState(false);
const [tutor , setTutor] = useState({});
const { id, modo } = router.query; 
const [isReadOnly, setIsReadOnly] = useState(false);

 
const [farmacosPos, setFarmacosPos] = useState(
  formData.pos?.farmacos ?? Array.from({ length: 5 }, () => ({
    farmaco: "", dose: "", via: ""
  }))
);



const timePoints = ["T0", "5'", "10'", "15'", "20'", "25'", "30'", "35'", "40'", "45'", "50'", "55'", "60'", "1h10'", "1h20'", "1h30'", "1h40'", "1h50'", "2h", "2h10'", "2h20", "2h30'", "2h40'", "2h50'", "3h", "3h10'", "3h20'", "3h30'", "3h40'", "3h50'", "4h"];
const parameters = ["Temperatura (T°C)", "FC(mpb)", "FR(mrm)", "PAS(mmHg)", "SPO2(%)", "Fluido(mL/kg/h)", "Resgate Alalgésico(mL)", "Vasopressor(mL)", "% Isoflurano"];


const initialData = timePoints.map(time => ({
  tempo: time,
  Temperatura: "",
  FC: "",
  FR: "",
  PAS: "",
  SPO2: "",
  Fluido: "",
  Resgate: "",
  Vasopressor: "",
  Isoflurano: ""
}));

const [data, setData] = useState(() => {
  // Se formData.pos.parametros existe e tem dados, use-os.
  // Caso contrário, use os dados iniciais vazios.
  if (formData.pos?.parametros && Array.isArray(formData.pos.parametros) && formData.pos.parametros.length > 0) {
    return formData.pos.parametros;
  }
  return createInitialData(); // Use a função para criar os dados iniciais
});

// Função para limpar apenas a tabela de parâmetros
  const limparTabela = () => {
    localStorage.removeItem("posAnestesiaTabela");
    const newInitialData = createInitialData();
    setData(initialData);
    
    // Atualiza o formData para refletir a limpeza
    setFormData(prev => ({
      ...prev,
      pos: {
        ...prev.pos,
        parametros: initialData
      }
    }));
  };

  // Handler modificado para limpar a tabela após envio
  const handleFinalizar = async () => {
    await handleSubmit(); 
    limparTabela();
  };

  useEffect(() => {
          // Se o modo for 'visualizar', define o estado para somente leitura
          if (modo === 'visualizar') {
              setIsReadOnly(true);
          }
      }, [modo]);

  // Atualize o useEffect para incluir data nas dependências
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      pos: { 
        ...prev.pos, 
        farmacos: farmacosPos,  
        parametros: data  // Garante que os dados da tabela estão incluídos
      }
    }));
  }, [farmacosPos, data, setFormData]); // Adicione data como dependência


const handleInputChange = (idx, param, value) => {
  setData(prevData => {
    const updatedData = [...prevData];
    updatedData[idx][param] = value;
    return updatedData;
  });
};

// Carregar do localStorage ao montar:
useEffect(() => {
  const savedData = localStorage.getItem("posAnestesiaTabela");
  if (savedData) {
    setData(JSON.parse(savedData));
  }
}, []);

// Sempre que a tabela mudar, salva no localStorage:
useEffect(() => {
  localStorage.setItem("posAnestesiaTabela", JSON.stringify(data));
}, [data]);




useEffect(() => {
  setFormData(prev => ({
    ...prev,
    pos: { ...prev.pos, farmacos: farmacosPos,  parametros: data  }
  }));
}, [farmacosPos, setFormData]);

const [farmacoPosAnestesico, setFarmacoPosAnestesico] = useState(
  formData.pos?.farmacoPosAnestesico ??               
  Array.from({ length: 5 }, () => ({
    farmaco: "", dose: "", via: "", hora: ""
  }))
);

useEffect(() => {
  setFormData(prev => ({
    ...prev,
    pos: { ...prev.pos, farmacoPosAnestesico }        
  }));
}, [farmacoPosAnestesico, setFormData]);

 useEffect(() => {
    if (router.isReady) {
        const id = router.query.fichaId;
        const animalId = router.query.animalId;
        if (id) {
        setConsultaId(id);
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

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  


const handleFarmacoPosChange = (idx, field, value) => {
  setFarmacosPos(prev => {
    const copy = structuredClone(prev);
    copy[idx][field] = value;
    return copy;
  });
};

const addFarmacoPosRow    = () =>
  setFarmacosPos(prev => [...prev, { farmaco: "", dose: "", via: "" }]);

const removeFarmacoPosRow = (idx) =>
  setFarmacosPos(prev => prev.filter((_, i) => i !== idx));

const handleFarmacoPosAnestesicoChange = (idx, field, value) => {
  setFarmacoPosAnestesico(prev => {
    const copy = structuredClone(prev);
    copy[idx][field] = value;
    return copy;
  });
};

const addFarmacoRow = () => {
    setFarmacosPos((prev) => [ 
        ...prev,
        { farmaco: "", dose: "", via: "" } // nova linha com campos vazios
    ]);
};
const removerUltimaFarmacoRow = () => {
    setFarmacosPos((prev) => {
        if (prev.length <= 1) return prev; // não permite remover se só houver uma linha
        return prev.slice(0, -1); // remove a última linha
    });
};


const addFarmacoPosAnestesicoRow = () => {
        setFarmacoPosAnestesico((prev) => [
            ...prev,  
            { farmaco: "", dose: "", via: "", hora: "" } // nova linha com campos vazios
        ]);
    };

    const removerUltimaFarmacoPosAnestesicoRow = () => {
        setFarmacoPosAnestesico((prev) => {
            if (prev.length <= 1) return prev; // não permite remover se só houver uma linha
            return prev.slice(0, -1); // remove a última linha  
        });
    };


return (
    <div className={styles.container}>
      <VoltarButton onClick={prevStep} />
      <h1>Ficha de Anestesiologia – Pós-Anestesia</h1>
      <div className={styles.boxBorder}>
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
                                  <div className={styles["animal-data-box"]}>
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

      <h5 className="p-2 rounded mt-4 mb-4" style={{ backgroundColor: '#EEF8F3' }}>Indução</h5>

      <div className="row align-items-center mb-3">
        {/* Hora ---------------------------------------------------- */}
        <div className="col-md-3">
          <label className="form-label fw-medium w-100">
            Hora
            <input
              type="time"
              className="form-control"
              name="pos.inducao.hora"
              value={formData.pos?.inducao?.hora || ""}
              disabled={isReadOnly}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Intubação ---------------------------------------------- */}
        <div className="col-md-9">
          {/* rótulo acima das opções */}
          <label className="form-label fw-medium mb-2 d-block">
            Intubação
          </label>

          {/* opções lado a lado */}
          <div className="d-flex align-items-center flex-wrap">
            {["Sim", "Não"].map((opt) => (
              <label
                key={opt}
                className="me-4 d-inline-flex align-items-center mb-1"
              >
                <input
                  type="radio"
                  name="pos.inducao.intubacao"
                  value={opt}
                  checked={formData.pos?.inducao?.intubacao === opt}
                  disabled={isReadOnly}
                  onChange={handleChange}
                  className="me-1"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.colum}>
      <table className={styles.tabela_tratamento}>
        <thead>
          <tr>
            <th style={{ width: "55%" }}>Fármaco</th>
            <th style={{ width: "25%" }}>Dose/Volume</th>
            <th style={{ width: "15%" }}>Via</th>
          </tr>
        </thead>

        <tbody>
          {farmacosPos.map((row, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={row.farmaco}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    handleFarmacoPosChange(idx, "farmaco", e.target.value)}
                />
              </td>

              <td>
                <input
                  type="text"
                  className="form-control"
                  value={row.dose}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    handleFarmacoPosChange(idx, "dose", e.target.value)}
                />
              </td>

              <td>
                <input
                  type="text"
                  className="form-control"
                  value={row.via}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    handleFarmacoPosChange(idx, "via", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.bolha_container}>
              <div className={styles.bolha} onClick={addFarmacoRow}>
              +
              </div>
              <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaFarmacoRow}>
              -
            </div>
          </div>
      </div>
    

      {/* ─────────── Sonda endotraqueal / Fluidoterapia ─────────── */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-medium">
            Número da sonda endotraqueal
          </label>
          <input
            type="text"
            className="form-control"
            name="pos.sondaEndotraqueal"       
            value={formData.pos?.sondaEndotraqueal || ""}
            disabled={isReadOnly}
            onChange={handleChange}
          />
        </div>

        {/* Fluidoterapia */}
        <div className="col-md-6">
          <label className="form-label fw-medium">
            Fluidoterapia
          </label>
          <input
            type="text"
            className="form-control"
            name="pos.fluidoterapia"
            value={formData.pos?.fluidoterapia || ""}
            disabled={isReadOnly}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ------------------ Outros ----------------- */}
      <div className="mb-3">
        <label className="form-label fw-medium">Outros:</label>
        <input
          type="text"
          className="form-control"
          name="pos.outros"
          value={formData.pos?.outros || ""}
          disabled={isReadOnly}
          onChange={handleChange}
        />
      </div>



      <h5 className="p-2 rounded mt-4 mb-4" style={{ backgroundColor: '#EEF8F3' }}>
        Fármacos Pós anestésicos
      </h5>
      <div className={styles.column}>

      <table className={styles.tabela_tratamento}>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Fármaco</th>
            <th style={{ width: "20%" }}>Dose/Volume</th>
            <th style={{ width: "15%" }}>Via</th>
            <th style={{ width: "20%" }}>Hora</th>
            
          </tr>
        </thead>

        <tbody>
          {farmacoPosAnestesico.map((row, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={row.farmaco}
                  disabled={isReadOnly}
                  onChange={e =>
                    handleFarmacoPosAnestesicoChange(idx, "farmaco", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={row.dose}
                  disabled={isReadOnly}
                  onChange={e =>
                    handleFarmacoPosAnestesicoChange(idx, "dose", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={row.via}
                  disabled={isReadOnly}
                  onChange={e =>
                    handleFarmacoPosAnestesicoChange(idx, "via", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  className="form-control"
                  value={row.hora}
                  disabled={isReadOnly}
                  onChange={e =>
                    handleFarmacoPosAnestesicoChange(idx, "hora", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.bolha_container}>
              <div className={styles.bolha} onClick={addFarmacoPosAnestesicoRow}>
              +
              </div>
              <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaFarmacoPosAnestesicoRow}>
              -
            </div>
          </div>
      </div>

      <h5 className="p-2 rounded mt-4 mb-4" style={{ backgroundColor: '#EEF8F3' }}>
        Trans anestésicos
      </h5>

      <div className="row align-items-center g-3">

      {/* Hora de início --------------------------------------------------- */}
      <div className="col-md-2">
        <label className="form-label w-100">
          Hora de início
          <input
            type="time"
            className="form-control"
            name="pos.recuperacao.horaInicio"
            value={formData.pos?.recuperacao?.horaInicio || ""}
            disabled={isReadOnly}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Hora final ------------------------------------------------------- */}
      <div className="col-md-2">
        <label className="form-label w-100">
          Hora final
          <input
            type="time"
            className="form-control"
            name="pos.recuperacao.horaFim"
            value={formData.pos?.recuperacao?.horaFim || ""}
            disabled={isReadOnly}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Duração (read-only) --------------------------------------------- */}
      {(() => {
        const ini = formData.pos?.recuperacao?.horaInicio;
        const fim = formData.pos?.recuperacao?.horaFim;

        if (!ini || !fim) return null;           // só exibe se ambos existirem

        // calcula diferença em minutos
        const [h1, m1] = ini.split(":").map(Number);
        const [h2, m2] = fim.split(":").map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60;           // caso passe da meia-noite

        const hh = String(Math.floor(diff / 60)).padStart(2, "0");
        const mm = String(diff % 60).padStart(2, "0");
        const dur = `${hh}:${mm}`;

        return (
          <div className="col-md-3">
            <label className="form-label w-100">
              Tempo de duração
              <input
                type="text"
                className="form-control"
                value={dur}
                readOnly
                disabled
              />
            </label>
          </div>
        );
      })()}

      {/* Suporte de oxigênio --------------------------------------------- */}
      <div className="col-md-5">
        <label className="form-label fw-medium mb-2 d-block">
          Suporte de Oxigênio:
        </label>

        {["Máscara", "Tubo orotraqueal", "Sem suporte"].map((opt) => (
          <label
            key={opt}
            className="me-4 d-inline-flex align-items-center mb-1"
          >
            <input
              type="radio"
              name="pos.recuperacao.suporteOxigenio"
              value={opt}
              checked={formData.pos?.recuperacao?.suporteOxigenio === opt}
              disabled={isReadOnly}
              onChange={handleChange}
              className="me-1"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>

    
    <div className="row align-items-center g-3 mt-4">

    {/* Hora Extubação ---------------------------------------------------- */}
    <div className="col-md-2">
      <label className="form-label w-100">
        Hora Extubação
        <input
          type="time"
          className="form-control"
          name="pos.extubacao3.horaExtubacao"
          value={formData.pos?.extubacao3?.horaExtubacao || ""}
          disabled={isReadOnly}
          onChange={handleChange}
        />
      </label>
    </div>

    {/* Respiração -------------------------------------------------------- */}
    <div className="col-md-10">
      <label className="form-label fw-medium mb-2 d-block">
        Respiração:
      </label>

      {[
        "Mecânica",
        "Assistida",
        "Espontânea",
        "Assistida & Espontânea",
      ].map((opt) => (
        <label
          key={opt}
          className="me-4 d-inline-flex align-items-center mb-1"
        >
          <input
            type="radio"
            name="pos.extubacao3.respiracao"
            value={opt}
            checked={formData.pos?.extubacao3?.respiracao === opt}
            disabled={isReadOnly}
            onChange={handleChange}
            className="me-1"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>

    {/* ▸ PROCEDIMENTO – horários + equipo --------------------------------- */}
  <div className="row align-items-center g-3 mt-4">

  {/* Início do Procedimento ------------------------------------------- */}
  <div className="col-md-2">
    <label className="form-label w-100">
      Início do Procedimento:
      <input
        type="time"
        className="form-control"
        name="pos.procedimento.horaInicio"
        value={formData.pos?.procedimento?.horaInicio || ""}
        disabled={isReadOnly}
        onChange={handleChange}
      />
    </label>
  </div>

  {/* Fim do Procedimento ---------------------------------------------- */}
  <div className="col-md-2">
    <label className="form-label w-100">
      Fim do Procedimento:
      <input
        type="time"
        className="form-control"
        name="pos.procedimento.horaFim"
        value={formData.pos?.procedimento?.horaFim || ""}
        disabled={isReadOnly}
        onChange={handleChange}
      />
    </label>
  </div>

  {/* Equipo ------------------------------------------------------------ */}
  <div className="col-md-8">
    <label className="form-label fw-medium mb-2 d-block">
      Equipo:
    </label>

    {["Macrogotas", "Microgotas"].map((opt) => (
      <label
        key={opt}
        className="me-4 d-inline-flex align-items-center mb-1"
      >
        <input
          type="radio"
          name="pos.procedimento.equipo"
          value={opt}
          checked={formData.pos?.procedimento?.equipo === opt}
          disabled={isReadOnly}
          onChange={handleChange}
          className="me-1"
        />
        {opt}
      </label>
    ))}
  </div>

<div>
  <h5 className="p-2 rounded mt-4 mb-4" style={{ backgroundColor: '#EEF8F3' }}>
        Parâmetros e Intervenções
  </h5>
      
      <table className={styles.parametrosTabela}>
        <thead>
          <tr>
            <th>Tempo</th>
            {parameters.map(param => (
              <th key={param}>{param}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.tempo}</td>
              {parameters.map(param => (
                <td key={param}>
                  <input
                    type="number"
                    className="form-control"
                    value={row[param]}
                    disabled={isReadOnly}
                    onChange={(e) => handleInputChange(idx, param, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráficos */}
      <div className="mt-5">
        {parameters.map((param) => (
          <div key={param} style={{ width: '100%',marginLeft: '-25px',  height: 300, marginBottom: 50 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                 <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="tempo" />
                <YAxis domain={[0, 45]} tickCount={10} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={param} stroke="#8884d8" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  

  <label htmlFor="pos-observacoes" className="form-label mb-0 fw-medium">
    Observações e Complicações
  </label>

  <textarea
    id="pos-observacoes"
    name="pos.observacoes"           
    className="form-control"
    rows={4}                         
    value={formData.pos?.observacoes || ""}
    disabled={isReadOnly}
    onChange={handleChange}
  />

<label htmlFor="pos-medicoResp" className="form-label mb-0 fw-medium">
    Médico(s) / Veterinário(s) Responsável:
  </label>
  <textarea
    id="pos-medicoResp"
    name="pos.medicoResponsavel"
    className="form-control mb-0"
    rows={1}                                 
    value={formData.pos?.medicoResponsavel || ""}
    disabled={isReadOnly}
    onChange={handleChange}
  />

  <label htmlFor="pos-plantonistas" className="form-label mb-0 lb-0 fw-medium">
    Plantonista(s) discente(s):
  </label>
  <textarea
    id="pos-plantonistas"
    name="pos.plantonistas"
    className="form-control"
    rows={1}                                  
    value={formData.pos?.plantonistas || ""}
    disabled={isReadOnly}
    onChange={handleChange}
  />

  </div>
      {!isReadOnly && (
      <div className={styles.button_box}>
            <VoltarWhiteButton onClick={prevStep} />
            <FinalizarFichaModal onConfirm={handleSubmit} />
      </div>
      )}
    </div>
    </div>
  );
}
