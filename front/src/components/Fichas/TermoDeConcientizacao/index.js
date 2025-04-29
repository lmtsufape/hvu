import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { getCurrentUsuario } from '../../../../services/userService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';

function TermoDeConcientizacao() {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [userId, setUserId] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
    
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
    const fichaData = {
      nome: "Ficha de sessão",
      
      dataHora: dataFormatada
    };

    // Cria o FormData e adiciona o JSON e o arquivo
    const formDataToSend = new FormData();
    formDataToSend.append("ficha", JSON.stringify(fichaData));
    formDataToSend.append("arquivo", selectedFile);

    try {
      const response = await fetch("/api/fichas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // Não defina Content-Type para FormData
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar a ficha");
      }

      const result = await response.json();
      console.log("Ficha enviada com sucesso:", result);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro:", error);
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
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
            <p>
              Pelo presente instrumento particular e na melhor forma do direito, os signatários deste, na qualidade de proprietário/tutor do animal acima identificado, doravante designado <strong>CONTRATANTE</strong>, e de outro lado, o Anestesista da UFAPE, de agora em diante designado <strong>CONTRATADO</strong>, têm entre si justo e contratado o que segue, que mutuamente aceitam e outorgam os seguintes procedimentos:
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

            <button type="button" onClick={handleDownloadPDF} className={styles.pdfButton}>
              Baixar termo em PDF
            </button>
            <div className={styles.submeter_button}>
              <label htmlFor="upload">Upload do termo assinado:</label>
              <input
                type="file"
                id="upload"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className={styles.button_box}>
            <button
              type="submit"
              className={styles.criar_button}
              disabled={!selectedFile}
            >
              Continuar
            </button>
          </div>
        </form>

        <Alert message="Ficha criada com sucesso!" show={showAlert} url={`/fichaSessao`} />
        {showErrorAlert && <ErrorAlert message={`Erro ao criar ficha: ${errorMessage}`} show={showErrorAlert} />}
      </div>
    </div>
  );
}

export default TermoDeConcientizacao;
