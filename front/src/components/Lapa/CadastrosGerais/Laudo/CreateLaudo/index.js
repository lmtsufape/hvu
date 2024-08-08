import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createLaudoNecropsia } from "../../../../../../services/laudoNecropsiaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import FichaSolicitacaoServicoList from "@/hooks/useFichaSolicitacaoList";
import { Modal, Button } from 'react-bootstrap';
import CampoLaudoList from "@/hooks/useCampoLaudoList";
import EstagiarioList from "@/hooks/useEstagiarioList";
import FotosList from "@/hooks/useFotoList";

function CreateLaudoNecropsia() {
    const router = useRouter();

    const [laudo, setLaudo] = useState({
        id: 0,
        conclusao: "",
        fichaSolicitacaoServico: { id: null },
        campoLaudo: [], 
    });

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    //Ficha de Solicitação de Serviços:
    const [filteredFichas, setFilteredFichas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchError, setSearchError] = useState(false);
    const [selectedFicha, setSelectedFicha] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { fichas = [], error: fichasError } = FichaSolicitacaoServicoList();
    console.log(fichas); // Verifique se está retornando como esperado
    if (fichasError) {
        console.error("Erro ao buscar fichas:", fichasError);
        return; // Ou exiba uma mensagem de erro
    }
    // --------------------------------------------------------

    //Campo Laudo
    const { campoLaudo = [], error: campoLaudoError } = CampoLaudoList();

    // Verificação de erro no campoLaudo
    if (campoLaudoError) {
        console.error("Erro ao buscar campos de laudo:", campoLaudoError);
    }

    const handleCampoLaudoChange = (event) => {
        const selectedCampoId = parseInt(event.target.value); // Pegando o ID selecionado
        const selectedCampo = campoLaudo.find(campo => campo.id === selectedCampoId);
        
        if (selectedCampo) {
            setLaudo(prevData => ({
                ...prevData,
                campoLaudo: [{ id: selectedCampo.id }] // Armazenando o campo selecionado
            }));
        }
    };
    // --------------------------------------------------------

    //Estagiário
    const [filteredEstagiarios, setFilteredEstagiarios] = useState([]);
    const [searchTermEstagiario, setSearchTermEstagiario] = useState("");
    const [searchErrorEstagiario, setSearchErrorEstagiario] = useState(false);
    const [showEstagiarioModal, setShowEstagiarioModal] = useState(false);

    const { estagiarios = [], error: estagiariosError } = EstagiarioList();
    console.log(estagiarios); // Verifique se está retornando como esperado

    const [selectedEstagiarioId, setSelectedEstagiarioId] = useState("");

    const handleEstagiarioChange = (event) => {
        const estagiarioId = event.target.value;
        setSelectedEstagiarioId(estagiarioId);
        
        // Atualiza o laudo com o ID do estagiário selecionado
        setLaudo(prevData => ({
            ...prevData,
            estagiario: [{ id: parseInt(estagiarioId) }] // Armazena o ID do estagiário selecionado
        }));
    };

    // --------------------------------------------------------

    //Foto
    const [selectedFotoId, setSelectedFotoId] = useState("");

    // Lógica para obter a lista de fotos
    const { fotos = [], error: fotosError } = FotosList(); // Certifique-se de que o hook está correto
    console.log(fotos); // Verifique se está retornando como esperado

    const handleFotoChange = (event) => {
        const fotoId = event.target.value;
        setSelectedFotoId(fotoId);
        
        // Atualiza o laudo com o ID da foto selecionada
        setLaudo(prevData => ({
            ...prevData,
            foto: [{ id: parseInt(fotoId) }] // Armazena o ID da foto selecionada
        }));
    };
    // --------------------------------------------------------

    const [campoMicroscopia, setCampoMicroscopia] = useState("");
    const handleLaudoChange = (event) => {
        const { name, value } = event.target;
        setLaudo(prevData => ({
            ...prevData,
            [name]: value,
            campoMicroscopia: campoMicroscopia // Adicione isso
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
            id: laudo.id, // Garante que o ID está correto
            conclusao: laudo.conclusao,
            fichaSolicitacaoServico: { id: laudo.fichaSolicitacaoServico.id }, // ID da ficha
            campoLaudo: laudo.campoLaudo.map(campo => ({ id: campo.id })), // Mapeia para o formato correto
            estagiario: [{ id: selectedEstagiarioId }], // ID do estagiário selecionado
            foto: [{ id: selectedFotoId }], // ID da foto selecionada
            campoMicroscopia: campoMicroscopia // Campo de microscopia
        };
    
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
    

    //Ficha de Solicitação de Serviços:

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        console.log('Searching for:', term);
    
        if (term) {
            const filtered = fichas.filter(ficha => 
                ficha.id.toString().includes(term) || ficha.codigoPatologia.toLowerCase().includes(term.toLowerCase())
            );
            console.log('Filtered fichas:', filtered); // Verifique o resultado do filtro
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
            fichaSolicitacaoServico: { id: ficha.id } // Armazena o ID da ficha selecionada
        }));

        setShowModal(false);
        setSearchTerm(ficha.codigoPatologia);
    };
    // ---------------------------------------------------------------------------

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Criar Laudo de Necropsia</h1>
            <div className={styles.form_box}>
                <div className={styles.inputs_container}>
                    <div className={styles.inputs_box}>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="conclusao" className="form-label">Conclusão <span className={styles.obrigatorio}>*</span></label>
                            <textarea
                                className={`form-control ${styles.input} ${errors.conclusao ? "is-invalid" : ""}`}
                                name="conclusao"
                                value={laudo.conclusao}
                                onChange={handleLaudoChange}
                            />
                            {errors.conclusao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.conclusao}</div>}
                        </div>
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
                            <label htmlFor="campoLaudo" className="form-label">Macroscopia</label>
                            <select
                                id="campoLaudo"
                                className="form-select"
                                onChange={handleCampoLaudoChange}
                            >
                                <option value="">Selecione a Macroscopia</option>
                                {campoLaudo.map(campo => (
                                    <option key={campo.id} value={campo.id}>
                                        {campo.descricao}
                                    </option>
                                ))}
                            </select>
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
                                value={selectedFotoId}
                                onChange={handleFotoChange}
                            >
                                <option value="">Selecione a Foto</option>
                                {fotos.map(foto => (
                                    <option key={foto.id} value={foto.id}>
                                        {foto.titulo} {/* Certifique-se de que 'titulo' está presente */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="campoMicroscopia" className="form-label">Microscopia</label>
                            <textarea
                                className={`form-control ${styles.input}`}
                                name="campoMicroscopia"
                                value={campoMicroscopia}
                                onChange={(e) => setCampoMicroscopia(e.target.value)} // Atualiza o estado
                            />
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
            {showAlert && <Alert message="Laudo de necropsia criado com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Erro ao criar laudo de necropsia, tente novamente." show={showErrorAlert} />}

            {/* Modal para seleção de ficha */}
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

export default CreateLaudoNecropsia;
