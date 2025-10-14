"use client"

import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createLaudoNecropsia } from "../../../../../../services/laudoNecropsiaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import FichaSolicitacaoServicoList from "@/hooks/useFichaSolicitacaoList";
import { Modal, Button } from "react-bootstrap";
import CampoLaudoList from "@/hooks/useCampoLaudoList";
import EstagiarioList from "@/hooks/useEstagiarioList";
import FotosList from "@/hooks/useFotoList";
import LaudoMicroscopiaList from "@/hooks/useLaudoMicroscopiaList";
import { getFotoById } from "../../../../../../services/fotoService";
import { getToken, getRoles } from "../../../../../../services/userService";

function CreateLaudoNecropsia() {
    const router = useRouter();

    const [laudo, setLaudo] = useState({
        id: 0,
        conclusao: "",
        descricaoMacroscopia: "",
        descricaoMicroscopia: "",
        fichaSolicitacaoServico: { id: null },
        campoLaudo: [],
        campoMicroscopia: []
    });

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [filteredFichas, setFilteredFichas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchError, setSearchError] = useState(false);
    const [selectedFicha, setSelectedFicha] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { fichas } = FichaSolicitacaoServicoList();
    const { campoLaudo } = CampoLaudoList();
    const { campoMicroscopiaOptions } = LaudoMicroscopiaList();
    const { estagiarios = [] } = EstagiarioList();
    const { fotos = [] } = FotosList();

    const roles = getRoles();
    const token = getToken();

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

    if (!roles.includes("patologista")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    // --- Campo Laudo ---
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

    const removeCampoLaudoField = (index) => {
        setLaudo(prevData => ({
            ...prevData,
            campoLaudo: prevData.campoLaudo.filter((_, i) => i !== index)
        }));
    };

    // --- Campo Microscopia ---
    const handleMicroscopiaChange = (event, index) => {
        const selectedMicroscopiaId = parseInt(event.target.value);
        setLaudo(prevData => {
            const newCampoMicroscopia = [...prevData.campoMicroscopia];
            newCampoMicroscopia[index] = { id: selectedMicroscopiaId };
            return { ...prevData, campoMicroscopia: newCampoMicroscopia };
        });
    };

    const addMicroscopiaField = () => {
        setLaudo(prevData => ({
            ...prevData,
            campoMicroscopia: [...prevData.campoMicroscopia, { id: "" }]
        }));
    };

    const removeMicroscopiaField = (index) => {
        setLaudo(prevData => ({
            ...prevData,
            campoMicroscopia: prevData.campoMicroscopia.filter((_, i) => i !== index)
        }));
    };

    // --- Estagiário ---
    const [selectedEstagiarioId, setSelectedEstagiarioId] = useState("");

    const handleEstagiarioChange = (event) => {
        const estagiarioId = event.target.value;
        setSelectedEstagiarioId(estagiarioId);

        setLaudo(prevData => ({
            ...prevData,
            estagiario: [{ id: parseInt(estagiarioId) }]
        }));
    };

    // --- Fotos ---
    const [selectedFotoIds, setSelectedFotoIds] = useState([]);
    const [previewFotos, setPreviewFotos] = useState([]);

    const fetchFotoPreview = async (id, titulo) => {
        try {
            const blob = await getFotoById(id);
            const url = URL.createObjectURL(blob);
            return { id, titulo, url };
        } catch (error) {
            console.error("Erro ao carregar foto:", error);
            return null;
        }
    };

    const handleFotoChange = async (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => ({
            id: parseInt(option.value),
            titulo: option.text,
        }));

        const newIds = selectedOptions.map((opt) => opt.id);
        setSelectedFotoIds(newIds);

        const previews = await Promise.all(
            selectedOptions.map((opt) => fetchFotoPreview(opt.id, opt.titulo))
        );

        setPreviewFotos(previews.filter((p) => p !== null));
    };

    const handleRemoveFoto = (id) => {
        setSelectedFotoIds((prev) => prev.filter((fotoId) => fotoId !== id));
        setPreviewFotos((prev) => prev.filter((foto) => foto.id !== id));
    };

    // --- Laudo ---
    const handleLaudoChange = (event) => {
        const { name, value } = event.target;
        setLaudo(prevData => ({ ...prevData, [name]: value }));
    };

    const handleLaudoCreate = async () => {
        const laudoToSend = {
            conclusao: laudo.conclusao,
            descricaoMacroscopia: laudo.descricaoMacroscopia,
            descricaoMicroscopia: laudo.descricaoMicroscopia,
            fichaSolicitacaoServico: { id: laudo.fichaSolicitacaoServico.id },
            campoLaudo: laudo.campoLaudo.map(campo => ({ id: campo.id })),
            estagiario: selectedEstagiarioId ? [{ id: parseInt(selectedEstagiarioId) }] : [],
            foto: selectedFotoIds.map((id) => ({ id })),
            campoMicroscopia: laudo.campoMicroscopia.map(microscopia => ({ id: microscopia.id }))
        };

        console.log("laudoToSend:", laudoToSend);
        try {
            await createLaudoNecropsia(laudoToSend);
            setShowAlert(true);
            setTimeout(() => {
                router.push("/lapa/gerenciarLaudos");
            }, 2000);
        } catch (error) {
            console.error("Erro ao criar laudo de necropsia:", error);
            setShowErrorAlert(true);
        }
    };

    // --- Ficha ---
    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term) {
            const filtered = fichas.filter(ficha =>
                ficha.id.toString().includes(term) || 
                (ficha.codigoPatologia && ficha.codigoPatologia.toLowerCase().includes(term.toLowerCase()))
            );
            setFilteredFichas(filtered);
            setSearchError(filtered.length === 0);
        } else {
            setFilteredFichas([]);
            setSearchError(true);
        }
    };

    const handleFichaSelection = (ficha) => {
        if (!ficha || !ficha.id) {
            console.error('Ficha inválida:', ficha);
            return;
        }

        setLaudo(prevData => ({
            ...prevData,
            fichaSolicitacaoServico: { id: ficha.id }
        }));

        setShowModal(false);
        setSearchTerm(ficha.codigoPatologia);
    };

    // --- JSX ---
    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Criar Laudo</h1>
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
                                    placeholder="Digite o Código Patologia"
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
                            {searchError && <div className="invalid-feedback">Por favor, digite um termo de pesquisa válido.</div>}
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="campoLaudo" className={`form-label ${styles.macroscopia_label}`}>Macroscopia</label>
                            {laudo.campoLaudo.map((campo, index) => (
                                <div className={styles.macroscopia_field} key={index}>
                                    <select
                                        id={`campoLaudo-${index}`}
                                        className={`form-select ${styles.macroscopia_select}`}
                                        value={campo.id}
                                        onChange={(e) => handleCampoLaudoChange(e, index)}
                                    >
                                        <option disabled value="">Selecione a Macroscopia</option>
                                        {campoLaudo.map(campo => (
                                            <option key={campo.id} value={campo.id}>{campo.descricao}</option>
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
                                <button type="button" className={`btn ${styles.add_button}`} onClick={addCampoLaudoField}>
                                    Adicionar Macroscopia
                                </button>
                            </div>
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="descricaoMacroscopia" className="form-label">Descrição Macroscopia</label>
                            <textarea
                                className={`form-control ${styles.input} ${errors.descricaoMacroscopia ? "is-invalid" : ""}`}
                                name="descricaoMacroscopia"
                                value={laudo.descricaoMacroscopia}
                                onChange={handleLaudoChange}
                            />
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="campoMicroscopia" className={`form-label ${styles.macroscopia_label}`}>Microscopia</label>
                            {laudo.campoMicroscopia.map((microscopia, index) => (
                                <div className={styles.macroscopia_field} key={index}>
                                    <select
                                        id={`campoMicroscopia-${index}`}
                                        className={`form-select ${styles.macroscopia_select}`}
                                        value={microscopia.id}
                                        onChange={(e) => handleMicroscopiaChange(e, index)}
                                    >
                                        <option disabled value="">Selecione a Microscopia</option>
                                        {campoMicroscopiaOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.descricao} {option.orgao ? `(${option.orgao.nome})` : ""}
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
                                <button type="button" className={`btn ${styles.add_button}`} onClick={addMicroscopiaField}>
                                    Adicionar Microscopia
                                </button>
                            </div>
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="descricaoMicroscopia" className="form-label">Descrição Microscopia</label>
                            <textarea
                                className={`form-control ${styles.input} ${errors.descricaoMicroscopia ? "is-invalid" : ""}`}
                                name="descricaoMicroscopia"
                                value={laudo.descricaoMicroscopia}
                                onChange={handleLaudoChange}
                            />
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="estagiario" className="form-label">Estagiário</label>
                            <select
                                id="estagiario"
                                className="form-select"
                                value={selectedEstagiarioId}
                                onChange={handleEstagiarioChange}
                            >
                                <option value="">Selecione o Estagiário</option>
                                {estagiarios.map(estagiario => (
                                    <option key={estagiario.id} value={estagiario.id}>{estagiario.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="foto" className="form-label">Fotos</label>
                            <select
                                id="foto"
                                className="form-select"
                                multiple
                                value={selectedFotoIds}
                                onChange={handleFotoChange}
                            >
                                {fotos.map((foto) => (
                                    <option key={foto.id} value={foto.id}>{foto.titulo}</option>
                                ))}
                            </select>
                            <small className="text-muted">Segure Ctrl (ou Cmd no Mac) para selecionar várias fotos</small>

                            <div className="mt-3 d-flex flex-wrap gap-3">
                                {previewFotos.map((foto) => (
                                    <div key={foto.id} className="position-relative text-center" style={{ width: "120px" }}>
                                        <img
                                            src={foto.url}
                                            alt={foto.titulo}
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                            style={{ borderRadius: "50%", padding: "2px 6px" }}
                                            onClick={() => handleRemoveFoto(foto.id)}
                                        >
                                            ❌
                                        </button>
                                        <p className="mt-1" style={{ fontSize: "0.9rem" }}>{foto.titulo}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="conclusao" className="form-label">Conclusão</label>
                            <textarea
                                className={`form-control ${styles.input} ${errors.conclusao ? "is-invalid" : ""}`}
                                name="conclusao"
                                value={laudo.conclusao}
                                onChange={handleLaudoChange}
                            />
                        </div>
                    </div>

                    {/* --- Botões --- */}
                    <div className={styles.button_box}>
                        <CancelarWhiteButton />
                        <button type="button" className={styles.cadastrar_button} onClick={handleLaudoCreate}>
                            Criar Laudo
                        </button>
                    </div>
                </div>
            </div>

            {showAlert && <Alert message="Laudo de necropsia criado com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Erro ao criar laudo de necropsia, tente novamente." show={showErrorAlert} />}

            {/* --- Modal Ficha --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecionar Ficha de Solicitação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {filteredFichas.length > 0 ? (
                        filteredFichas.map(ficha => (
                            <div key={ficha.id} className={styles.term} onClick={() => handleFichaSelection(ficha)}>
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

export default CreateLaudoNecropsia;
