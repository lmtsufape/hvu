import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { getCurrentUsuario } from '../../../../services/userService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { createFicha } from '../../../../services/fichaService';
import FinalizarFichaModal from "../FinalizarFichaModal";
import { CancelarWhiteButton } from "../../WhiteButton";

function TermoDeConcientizacao() {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [userId, setUserId] = useState(null);
    
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedRoles = JSON.parse(localStorage.getItem('roles'));
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUsuario();
        setUserId(userData.usuario.id);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!roles.includes("medico")) {
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {

  const reader = new FileReader();
  reader.onloadend = async () => {

    const termoConscientizacaoBase64 = reader.result; 
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
    const fichaData = {
      nome: "Termo de Conscientização",  
      conteudo: {
        termoDeConscientizacao: termoConscientizacaoBase64
      },
      dataHora: dataFormatada 
    };

    try {
      console.log("fichaData:", fichaData);
      await createFicha(fichaData);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
      if (error.response && error.response.data && error.response.data.code) {
        setErrorMessage(error.response.data.message);
      }
      setShowErrorAlert(true);
    }
  };

  reader.readAsDataURL(selectedFile);  // Inicia a leitura do arquivo
  };

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = "/termo01.pdf";
    link.download = "termo01.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Termo de Conscientização livre e esclarecida para a realização do Procedimento Anestésico</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
          <div className={styles.termo_box}>

            <button className={styles.dados_ocultos} type="button">
                Identificação do animal
                <span>+</span>
            </button>
            <p>
              Pelo presente instrumento particular e na melhor forma do direito, os signatários deste, na qualidade de proprietário/tutor do animal acima identificado, doravante designado CONTRATANTE, e de outro lado, o Anestesista da UFAPE, de agora em diante designado CONTRATADO, têm entre si justo e contratado o que segue, que mutuamente aceitam e outorgam os seguintes procedimentos:
            </p>
            <h3>REFERENTE AO PROCEDIMENTO ANESTÉSICO</h3>
            <ol>
              <li>O CONTRATANTE está de acordo que seu animal seja submetido a uma anestesia geral, e/ou anestesia local, e/ou anestesia regional, e/ou anestesia epidural, que será estabelecida pelo CONTRATADO.</li>
              <li>O CONTRATANTE autoriza a administração de anestésicos e analgésicos que sejam considerados necessários pelos Médicos Veterinários responsáveis pelo procedimento, sem qualquer exceção.</li>
              <li>O CONTRATANTE declara que a natureza e os objetivos da anestesia e procedimentos, os riscos envolvidos, bem como a possibilidade de complicações foram previamente e devidamente esclarecidos com o CONTRATADO.</li>
              <li>O CONTRATANTE responsabiliza-se a cumprir as orientações recebidas quanto aos cuidados pós-anestésicos, (se houverem) bem como a não dar nenhum medicamento, além dos receitados pelo Médico Veterinário responsável pelo caso.</li>
              <li>O CONTRATANTE (proprietário/tutor) reconhece que a prestação dos serviços ora oferecida se dá como um contrato de meios, e não de resultados, não podendo estes serem garantidos, em virtude da já mencionada imprevisibilidade relativa de fenômenos biológicos e individuais (conforme ITEM 3).</li>
              <li>Fica claro que como proprietário/tutor e/ou responsável pelo animal, O CONTRATANTE compromete-se a deixar o animal em jejum alimentar e hídrico sugerido pelo CONTRATADO (Anestesista).</li>
              <li>O CONTRATANTE poderá revogar o presente consentimento, bastando para tanto que comunique sua decisão ao seu médico anestesista antes do início do procedimento anestésico e assine o Termo de Recusa Livre e Esclarecida.</li>
            </ol>
            <p>
              E para que fique registrado o seu pleno consentimento em submeter seu animal ao procedimento anestésico acima descrito, firma o presente documento.
            </p>

            <div className={styles.button_submit}>
              <button type="button" onClick={handleDownloadPDF} className={styles.pdfButton}>
                Baixar
              </button>
              <div>
                <label htmlFor="upload" className={styles.pdfButton}>Submeter</label>
                <input
                  type="file"
                  id="upload"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          <div className={styles.button_box}>
            < CancelarWhiteButton />
            < FinalizarFichaModal onConfirm={handleSubmit} disabled={!selectedFile}/>
          </div>
        </form>

        <Alert message="Ficha criada com sucesso!" show={showAlert} url={`/termoDeConcientizacao`} />
        {showErrorAlert && <ErrorAlert message={`Erro ao criar ficha: ${errorMessage}`} show={showErrorAlert} />}
      </div>
    </div>
  );
}

export default TermoDeConcientizacao;
