import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createLaudoMicroscopia } from "../../../../../../services/laudoMicroscopiaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import FichaSolicitacaoServicoList from "@/hooks/useFichaSolicitacaoList";
import { Modal, Button } from 'react-bootstrap';
import CampoLaudoList from "@/hooks/useCampoLaudoList";
import EstagiarioList from "@/hooks/useEstagiarioList";
import FotosList from "@/hooks/useFotoList";
import LaudoMicroscopiaList from "@/hooks/useLaudoMicroscopiaList";
import { getToken, getRoles } from "../../../../../../services/userService";

function CreateLaudoMicroscopia() {
    const router = useRouter();

    const [laudo, setLaudo] = useState({
        campoLaudo: [{ id: "" }],
        estagiario: [{ id: "" }],
        foto: [{ id: "" }],
        campoMicroscopia: [], // Certifique-se de que isso seja um array
        conclusao: ""
    });
    
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFichas, setFilteredFichas] = useState([]);
    const [searchError, setSearchError] = useState(false);

    const { fichas = [], error: fichasError } = FichaSolicitacaoServicoList();
    const { campoLaudo = [], error: campoLaudoError } = CampoLaudoList();
    const { estagiarios = [], error: estagiariosError } = EstagiarioList();
    const { fotos = [], error: fotosError } = FotosList();
    const { campoMicroscopiaOptions = [], error: microscopiaError } = LaudoMicroscopiaList();

    const roles = getRoles();
    const token= getToken();

    if (!token) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Faça login para acessar esta página.
            </h3>
        </div>
        );
    }

    if (!roles.includes("patologista")) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Você não tem permissão para acessar esta página.
            </h3>
        </div>
        );
    }

    const handleCampoLaudoChange = (event, index) => {
        const selectedCampoId = parseInt(event.target.value);
        const selectedCampo = campoLaudo.find(campo => campo.id === selectedCampoId);

        if (selectedCampo) {
            setLaudo(prevData => {
                const newCampoLaudo = [...prevData.campoLaudo];
                newCampoLaudo[index] = { id: selectedCampo.id };
                return { ...prevData, campoLaudo: newCampoLaudo };
            });
        }
    };

    const addCampoLaudoField = () => {
        setLaudo(prevData => ({
            ...prevData,
            campoLaudo: [...prevData.campoLaudo, { id: "" }]
        }));
    };

    const addMicroscopiaField = () => {
        setLaudo(prevData => ({
            ...prevData,
            campoMicroscopia: [...prevData.campoMicroscopia, { id: "" }]
        }));
    };
    

    const removeCampoLaudoField = (index) => {
        setLaudo(prevData => ({
            ...prevData,
            campoLaudo: prevData.campoLaudo.filter((_, i) => i !== index)
        }));
    };

    const removeMicroscopiaField = (index) => {
        setLaudo(prevData => ({
            ...prevData,
            campoMicroscopia: prevData.campoMicroscopia.filter((_, i) => i !== index)
        }));
    };
    

    const handleMicroscopiaChange = (event) => {
        const selectedMicroscopia = event.target.value;
        setLaudo(prevData => ({
            ...prevData,
            campoMicroscopia: selectedMicroscopia
        }));
    };

    const handleEstagiarioChange = (event) => {
        const estagiarioId = event.target.value;
        setLaudo(prevData => ({
            ...prevData,
            estagiario: [{ id: parseInt(estagiarioId) }]
        }));
    };

    const handleFotoChange = (event) => {
        const fotoId = event.target.value;
        setLaudo(prevData => ({
            ...prevData,
            foto: [{ id: parseInt(fotoId) }]
        }));
    };

    const handleLaudoChange = (event) => {
        const { name, value } = event.target;
        setLaudo(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!laudo.conclusao) {
            errors.conclusao = "Campo obrigatório";
        }
        return errors;
    };

    const handleLaudoCreate = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const laudoToSend = {
            id: laudo.id,
            conclusao: laudo.conclusao,
            fichaSolicitacaoServico: { id: laudo.fichaSolicitacaoServico.id },
            campoLaudo: laudo.campoLaudo.map(campo => ({ id: campo.id })),
            estagiario: laudo.estagiario,
            foto: laudo.foto,
            campoMicroscopia: laudo.campoMicroscopia
        };

        try {
            await createLaudoMicroscopia(laudoToSend);
            setShowAlert(true);
            setTimeout(() => {
                router.push("/laudoMicroscopia/gerenciarLaudos");
            }, 2000);
        } catch (error) {
            console.error("Erro ao criar laudo de microscopia:", error);
            setShowErrorAlert(true);
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term) {
            const filtered = fichas.filter(ficha =>
                ficha.id.toString().includes(term) || ficha.codigoPatologia.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredFichas(filtered);
            setSearchError(filtered.length === 0);
        } else {
            setFilteredFichas([]);
            setSearchError(true);
        }
    };

    const handleFichaSelection = (ficha) => {
        if (ficha?.id) {
            setLaudo(prevData => ({
                ...prevData,
                fichaSolicitacaoServico: { id: ficha.id }
            }));
            setShowModal(false);
            setSearchTerm(ficha.codigoPatologia);
        } else {
            console.error('Ficha inválida:', ficha);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Criar Laudo de Microscopia</h1>
            <div className={styles.form_box}>
                <div className={styles.inputs_container}>
                    <div className={styles.inputs_box}>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="search" className="form-label">Pesquisar Ficha de Solicitação</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control ${searchError ? 'is-invalid' : ''}`}
                                    id="search"
                                    placeholder="Digite o ID ou Código Patologia"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowModal(true)}
                                >
                                    Buscar
                                </button>
                            </div>
                            {searchError && (
                                <div className="invalid-feedback">
                                    Por favor, digite um termo de pesquisa válido.
                                </div>
                            )}
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="campoLaudo" className={`form-label ${styles.macroscopia_label}`}>
                                Macroscopia
                            </label>
                            {laudo.campoLaudo.map((campo, index) => (
                                <div className={styles.macroscopia_field} key={index}>
                                    <select
                                        id={`campoLaudo-${index}`}
                                        className={`form-select ${styles.macroscopia_select}`}
                                        value={campo.id}
                                        onChange={(e) => handleCampoLaudoChange(e, index)}
                                    >
                                        <option value="">Selecione a Macroscopia</option>
                                        {campoLaudo.map(campo => (
                                            <option key={campo.id} value={campo.id}>
                                                {campo.descricao}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className={`btn btn-danger ${styles.macroscopia_button}`}
                                        onClick={() => removeCampoLaudoField(index)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                            <div className={styles.add_button_container}>
                                <button
                                    type="button"
                                    className={`btn ${styles.add_button}`}
                                    onClick={addCampoLaudoField}
                                >
                                    Adicionar Macroscopia
                                </button>
                            </div>
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="estagiario" className="form-label">Estagiário</label>
                            <select
                                id="estagiario"
                                className="form-select"
                                value={laudo.estagiario[0]?.id || ""}
                                onChange={handleEstagiarioChange}
                            >
                                <option value="">Selecione o Estagiário</option>
                                {estagiarios.map(estagiario => (
                                    <option key={estagiario.id} value={estagiario.id}>
                                        {estagiario.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="foto" className="form-label">Foto</label>
                            <select
                                id="foto"
                                className="form-select"
                                value={laudo.foto[0]?.id || ""}
                                onChange={handleFotoChange}
                            >
                                <option value="">Selecione a Foto</option>
                                {fotos.map(foto => (
                                    <option key={foto.id} value={foto.id}>
                                        {foto.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="campoMicroscopia" className={`form-label ${styles.macroscopia_label}`}>
                                Microscopia
                            </label>
                            {laudo.campoMicroscopia.map((microscopia, index) => (
                                <div className={styles.macroscopia_field} key={index}>
                                    <select
                                        id={`campoMicroscopia-${index}`}
                                        className={`form-select ${styles.macroscopia_select}`}
                                        value={microscopia.id}
                                        onChange={(e) => handleMicroscopiaChange(e, index)}
                                    >
                                        <option value="">Selecione a Microscopia</option>
                                        {campoMicroscopiaOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.descricao}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className={`btn btn-danger ${styles.macroscopia_button}`}
                                        onClick={() => removeMicroscopiaField(index)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                            <div className={styles.add_button_container}>
                                <button
                                    type="button"
                                    className={`btn ${styles.add_button}`}
                                    onClick={addMicroscopiaField}
                                >
                                    Adicionar Microscopia
                                </button>
                            </div>
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="conclusao" className="form-label">
                                Diagnóstico do Patologista <span className={styles.obrigatorio}>*</span>
                            </label>
                            <textarea
                                className={`form-control ${styles.input} ${errors.conclusao ? "is-invalid" : ""}`}
                                name="conclusao"
                                value={laudo.conclusao}
                                onChange={handleLaudoChange}
                            />
                            {errors.conclusao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.conclusao}</div>}
                        </div>
                    </div>
                    <div className={styles.button_box}>
                        <CancelarWhiteButton />
                        <button type="button" className={styles.cadastrar_button} onClick={handleLaudoCreate}>
                            Criar Laudo
                        </button>
                    </div>
                </div>
            </div>
            {showAlert && <Alert message="Laudo de microscopia criado com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Erro ao criar laudo de microscopia, tente novamente." show={showErrorAlert} />}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecionar Ficha de Solicitação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {filteredFichas.length > 0 ? (
                        filteredFichas.map(ficha => (
                            <div key={ficha.id} onClick={() => handleFichaSelection(ficha)}>
                                {ficha.codigoPatologia}
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma ficha encontrada.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Fechar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateLaudoMicroscopia;

