import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { createFicha } from '../../../../services/fichaService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import FinalizarFichaModal from "../FinalizarFichaModal";

function FichaSolicitacaoExame() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showOtherInputHematologia, setShowOtherInputHematologia] = useState(false);
    const [otherValueHematologia, setOtherValueHematologia] = useState("");
    const [showOtherInputUrinalise, setShowOtherInputUrinalise] = useState(false);
    const [otherValueUrinalise, setOtherValueUrinalise] = useState("");
    const [showOtherInputParasitologico, setShowOtherInputParasitologico] = useState(false);
    const [otherValueParasitologico, setOtherValueParasitologico] = useState("");
    const [showOtherInputBioquimica, setShowOtherInputBioquimica] = useState(false);
    const [otherValueBioquimica, setOtherValueBioquimica] = useState("");
    const [showOtherInputCitologia, setShowOtherInputCitologia] = useState(false);
    const [otherValueCitologia, setOtherValueCitologia] = useState("");
    const [showOtherInputImunologicos, setShowOtherInputImunologicos] = useState(false);
    const [otherValueImunologicos, setOtherValueImunologicos] = useState("");
    const [showOtherInputImaginologia, setShowOtherInputImaginologia] = useState(false);
    const [otherValueImaginologia, setOtherValueImaginologia] = useState("");
    const [showOtherInputCardiologia, setShowOtherInputCardiologia] = useState(false);
    const [otherValueCardiologia, setOtherValueCardiologia] = useState("");


    const [errors, setErrors] = useState({});
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [consultaId, setConsultaId] = useState(null);


    const [formData, setFormData] = useState({
        hematologiaDiagnostica: [],
        urinalise: [],
        parasitologico: [],
        bioquimicaClinica: [],
        citologiaHistopatologia: [],
        imunologicos: [],
        imaginologia: [],
        cardiologia: [],
    });

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("solicitacaoExameFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []); 

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("solicitacaoExameFormData", JSON.stringify(formData));
        }
    }, [formData]); 

    // Obtém o ID da ficha da URL
    useEffect(() => {
      if (router.isReady) {
          const id = router.query.fichaId;
          if (id) {
            setConsultaId(id);
            console.log("ID da ficha:", id);
          }
      }
    }, [router.isReady, router.query.fichaId]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const storedData = localStorage.getItem("formData");
        if (storedData) {
            try {
                setFormData(JSON.parse(storedData));
            } catch (error) {
                console.error("Erro ao carregar os dados do localStorage", error);
            }
        }
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

    const handleCheckboxChange = (event, field, setShowOtherInput, setOtherValue) => {
        const { value, checked } = event.target;

        if (value === "Outros(s):") {
            setShowOtherInput(checked);
            if (!checked) setOtherValue("");
        }

        setFormData((prev) => {
            if (field === "hematologiaDiagnostica") {
                return {
                    ...prev,
                    hematologiaDiagnostica: checked
                        ? [...prev.hematologiaDiagnostica, value]
                        : prev.hematologiaDiagnostica.filter((item) => item !== value)
                };
            }

            if (field === "urinalise") {
                return {
                    ...prev,
                    urinalise: checked
                        ? [...prev.urinalise, value]
                        : prev.urinalise.filter((item) => item !== value)
                };
            }
            if (field === "parasitologico") {
                return {
                    ...prev,
                    parasitologico: checked
                        ? [...prev.parasitologico, value]
                        : prev.parasitologico.filter((item) => item !== value)
                };
            }
            if (field === "bioquimicaClinica") { // Adicionado para Bioquímica Clínica
                return {
                    ...prev,
                    bioquimicaClinica: checked
                        ? [...prev.bioquimicaClinica, value]
                        : prev.bioquimicaClinica.filter((item) => item !== value)
                };
            }
            if (field === "citologiaHistopatologia") {
                return {
                    ...prev,
                    citologiaHistopatologia: checked
                        ? [...prev.citologiaHistopatologia, value]
                        : prev.citologiaHistopatologia.filter((item) => item !== value)
                };
            }
            if (field === "imunologicos") {
                return {
                    ...prev,
                    imunologicos: checked
                        ? [...prev.imunologicos, value]
                        : prev.imunologicos.filter((item) => item !== value)
                };
            }
            if (field === "imaginologia") {
                return {
                    ...prev,
                    imaginologia: checked
                        ? [...prev.imaginologia, value]
                        : prev.imaginologia.filter((item) => item !== value)
                };
            }
            if (field === "cardiologia") {
                return {
                    ...prev,
                    cardiologia: checked
                        ? [...prev.cardiologia, value]
                        : prev.cardiologia.filter((item) => item !== value)
                };
            }

            return prev;
        });
    };

    const handleSubmit = async (event) => {
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");

        let hematologiaDiagnosticaFinal = [...formData.hematologiaDiagnostica];
        let urinaliseFinal = [...formData.urinalise];
        let parasitologicoFinal = [...formData.parasitologico];
        let bioquimicaClinicaFinal = [...formData.bioquimicaClinica];
        let citologiaHistopatologiaFinal = [...formData.citologiaHistopatologia];
        let imunologicosFinal = [...formData.imunologicos];
        let imaginologiaFinal = [...formData.imaginologia];
        let cardiologiaFinal = [...formData.cardiologia];

        if (hematologiaDiagnosticaFinal.includes("Outros(s):") && otherValueHematologia.trim() !== "") {
            hematologiaDiagnosticaFinal = hematologiaDiagnosticaFinal.filter(item => item !== "Outros(s):");
            hematologiaDiagnosticaFinal.push(otherValueHematologia.trim());
        }

        if (urinaliseFinal.includes("Outros(s):") && otherValueUrinalise.trim() !== "") {
            urinaliseFinal = urinaliseFinal.filter(item => item !== "Outros(s):");
            urinaliseFinal.push(otherValueUrinalise.trim());
        }
        if (parasitologicoFinal.includes("Outros(s):") && otherValueParasitologico.trim() !== "") {
            parasitologicoFinal = parasitologicoFinal.filter(item => item !== "Outros(s):");
            parasitologicoFinal.push(otherValueParasitologico.trim());
        }
        if (bioquimicaClinicaFinal.includes("Outros(s):") && otherValueBioquimica.trim() !== "") { // Adicionado para Bioquímica Clínica
            bioquimicaClinicaFinal = bioquimicaClinicaFinal.filter(item => item !== "Outros(s):");
            bioquimicaClinicaFinal.push(otherValueBioquimica.trim());
        }
        if (citologiaHistopatologiaFinal.includes("Outros(s):") && otherValueCitologia.trim() !== "") {
            citologiaHistopatologiaFinal = citologiaHistopatologiaFinal.filter(item => item !== "Outros(s):");
            citologiaHistopatologiaFinal.push(otherValueCitologia.trim());
        }
        if (imunologicosFinal.includes("Outros(s):") && otherValueImunologicos.trim() !== "") {
            imunologicosFinal = imunologicosFinal.filter(item => item !== "Outros(s):");
            imunologicosFinal.push(otherValueImunologicos.trim());
        }
        if (imaginologiaFinal.includes("Outros(s):") && otherValueImaginologia.trim() !== "") {
            imaginologiaFinal = imaginologiaFinal.filter(item => item !== "Outros(s):");
            imaginologiaFinal.push(otherValueImaginologia.trim());
        }
        if (cardiologiaFinal.includes("Outros(s):") && otherValueCardiologia.trim() !== "") {
            cardiologiaFinal = cardiologiaFinal.filter(item => item !== "Outros(s):");
            cardiologiaFinal.push(otherValueCardiologia.trim());
        }

        const fichaData = {
            nome: "Ficha Solicitação de Exame",
            conteudo: {
                HematologiaDiagnóstica: hematologiaDiagnosticaFinal,
                Urinálise: urinaliseFinal,
                Parasitologico: parasitologicoFinal,
                BioquímicaClínica: bioquimicaClinicaFinal,
                CitologiaHistopatologia: citologiaHistopatologiaFinal,
                Imunológicos: imunologicosFinal,
                Imaginologia: imaginologiaFinal,
                Cardiologia: cardiologiaFinal,
            },
            dataHora: dataFormatada
        };

        try {
            const resultado = await createFicha(fichaData);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("solicitacaoExameFormData");
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            setShowErrorAlert(true);
        }
    };

    const cleanLocalStorage = () => {
        localStorage.removeItem("solicitacaoExameFormData");
    }

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Solicitação de Exame</h1>

            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
                     <button className={styles.dados_ocultos} type="button">
                        Dados do animal
                        <span>+</span>
                    </button>

                     <div className={styles.titulo}>
                        Hematologia Diagnóstica
                    </div>
                    <div className={styles.checkbox_container}>
                        {["Hemograma Parcial mais Proteínas Plasmáticas Totais", "Proteínas Plasmáticas Totais", "Hemograma Parcial", "Hematócrito/Volume Globular", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.hematologiaDiagnostica.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "hematologiaDiagnostica", setShowOtherInputHematologia, setOtherValueHematologia)}
                                    className="form-control"
                                />
                                {item}
                            </label>
                        ))}
                    
                    {showOtherInputHematologia && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueHematologia}
                            onChange={(e) => setOtherValueHematologia(e.target.value)}
                            className="form-control"
                        />
                    )}
                    </div>

                    <h2>Urinálise</h2>
                    <div className={styles.checkbox_container}>
                        {["Urinálise Completo", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.urinalise.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "urinalise", setShowOtherInputUrinalise, setOtherValueUrinalise)}
                                />
                                {item}
                            </label>
                        ))}
                        {showOtherInputUrinalise && (
                            <input
                                type="text"
                                placeholder="Digite aqui..."
                                value={otherValueUrinalise}
                                onChange={(e) => setOtherValueUrinalise(e.target.value)}
                                className="form-control"
                            />
                        )}
                    </div>

                    <h2>parasitologico</h2>
                    <div className={styles.checkbox_container}>
                        {["Coproparasitológico", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.parasitologico.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "parasitologico", setShowOtherInputParasitologico, setOtherValueParasitologico)}
                                />
                                {item}
                            </label>
                        ))}
                    {showOtherInputParasitologico && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueParasitologico}
                            onChange={(e) => setOtherValueParasitologico(e.target.value)}
                            className="form-control"
                        />
                    )}
                    </div>
                     {/* Adicionado o campo de Bioquímica Clínica */}
                     <h2>Bioquímica Clínica</h2>
                    <div className={styles.checkbox_container}>
                        {["Creatinina (CREA)", "Ureia (UR)", "ALT/TGP", "AST/TGO", "Fosfatase alcalina (FA)", "Gama - Glutamiltransferase (GGT)", "Bilirrubina total e frações (BT + BD + BI)", "Proteínas totais (PT)", "Albumina (ALB)", "Globulinas (GLOB)", "Triglicerides (TG)", "Colesterol Total (COL)", "Colesteróis HDL e LDL", "Glicose (GLI)", "Creatina quinase (CK/CPK)", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.bioquimicaClinica.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "bioquimicaClinica", setShowOtherInputBioquimica, setOtherValueBioquimica)}
                                />
                                {item}
                            </label>
                        ))}
                    {showOtherInputBioquimica && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueBioquimica}
                            onChange={(e) => setOtherValueBioquimica(e.target.value)}
                            className="form-control"
                        />
                    )}
                    </div>
                    <h2>Citologia/Histopatologia</h2>
                    <div className={styles.checkbox_container}>
                        {["Citologia cutânea", "Raspado cutâneo", "Citologia oncológica", "Histopatológico", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.citologiaHistopatologia.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "citologiaHistopatologia", setShowOtherInputCitologia, setOtherValueCitologia)}
                                />
                                {item}
                            </label>
                        ))}
                    {showOtherInputCitologia && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueCitologia}
                            onChange={(e) => setOtherValueCitologia(e.target.value)}
                            className="form-control"
                        />
                    )}
                    </div>
                     <h2>Imunológicos</h2>
                    <div className={styles.checkbox_container}>
                        {["Teste rápido Cinomose", "Teste rápido Erliquiose", "Teste rápido Leishmaniose", "FIV/FELV", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.imunologicos.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "imunologicos", setShowOtherInputImunologicos, setOtherValueImunologicos)}
                                />
                                {item}
                            </label>
                        ))}
                    {showOtherInputImunologicos && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueImunologicos}
                            onChange={(e) => setOtherValueImunologicos(e.target.value)}
                            className="form-control"
                        />
                    )}
                    </div>
                    <h2>Imaginologia</h2>
                    <div className={styles.checkbox_container}>
                        {["Ultrassonografia", "Radiografia", "Mielografia", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.imaginologia.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "imaginologia", setShowOtherInputImaginologia, setOtherValueImaginologia)}
                                />
                                {item}
                            </label>
                        ))}
                    {showOtherInputImaginologia && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueImaginologia}
                            onChange={(e) => setOtherValueImaginologia(e.target.value)}
                            className="form-control"
                        />
                    )}
                    </div>
                     <h2>Cardiologia</h2>
                    <div className={styles.checkbox_container}>
                        {["Eletrocardiograma", "Ecocardiograma", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.cardiologia.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "cardiologia", setShowOtherInputCardiologia, setOtherValueCardiologia)}
                                />
                                {item}
                            </label>
                        ))}
                    {showOtherInputCardiologia && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueCardiologia}
                            onChange={(e) => setOtherValueCardiologia(e.target.value)}
                            className="form-control"
                        />
                    )}
                    </div>


                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage}/>
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>

                {showAlert && consultaId &&
                <div className={styles.alert}>
                    <Alert message="Ficha criada com sucesso!" 
                    show={showAlert} url={`/createConsulta/${consultaId}`} />
                </div>}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}

            </div>
        </div>
    );
}

export default FichaSolicitacaoExame;