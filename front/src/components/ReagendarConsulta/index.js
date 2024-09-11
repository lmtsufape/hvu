import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { reagendamento } from '../../../services/agendamentoService';
import { getAllVaga } from "../../../services/vagaService";
import { CancelarWhiteButton } from "../WhiteButton";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function ReagendarConsulta() {
    const router = useRouter();
    const { id } = router.query;

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [vagas, setVagas] = useState([]);
    const [vagasFiltradas, setVagasFiltradas] = useState([]);
    const [novaData, setNovaData] = useState('');
    const [selectedVaga, setSelectedVaga] = useState(null); // Alterado para null inicialmente

    console.log("vagas:", vagas);
    console.log("novaData:", novaData);
    console.log("vagasFiltradas:", vagasFiltradas);
    console.log("selectedVaga:", selectedVaga); // Log da vaga selecionada

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vagasList = await getAllVaga();
                console.log("vagasList:", vagasList);
    
                setVagas(vagasList.filter(vaga => vaga.status === "Disponível"));
            } catch (error) {
                console.error('Erro ao buscar vagas:', error);
            }
        };
    
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleNovaDataChange = (event) => {
        const novaDataSelecionada = event.target.value;
        setNovaData(novaDataSelecionada); 

        // Aguarda o preenchimento de `vagas` e faz o filtro apenas se houver vagas carregadas
        if (vagas.length > 0) {
            const vagasDisponiveisNaData = vagas.filter(vaga => vaga.dataHora.startsWith(novaDataSelecionada));
            setVagasFiltradas(vagasDisponiveisNaData);
        }
    };
    
    const formatarData = (dataSemFormato) => {
        const data = new Date(dataSemFormato);
    
        // Extrair dia, mês e ano
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em 0
        const ano = data.getFullYear();
    
        // Extrair horas e minutos
        const horas = data.getHours().toString().padStart(2, '0');
        const minutos = data.getMinutes().toString().padStart(2, '0');
    
        // Retornar a string formatada
        return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
    }

    // Função que recebe o objeto da vaga e o define como a vaga selecionada
    const handleVagaSelection = (event, vaga) => {
        event.preventDefault(); // Evita o recarregamento da página
        setSelectedVaga(vaga); // Define a vaga selecionada
    }

    const handleReagendarVaga = async () => {
        try {
            if (!id || !selectedVaga) {
                throw new Error("Agendamento ID ou vaga selecionada não encontrada.");
            }

            await reagendamento(id, selectedVaga.id, selectedVaga.dataHora);
            
            console.log("Reagendamento concluído com sucesso!");
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao reagendar vaga:', error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Reagendar consulta</h1>
            <form className={styles.inputs_container}>
                <div className={styles.label_box}> 
                    <label htmlFor="data" className="form-label">
                        Nova data: 
                    </label>
                    <input
                        type="date"
                        className={styles.input}
                        value={novaData}
                        onChange={handleNovaDataChange}
                    />
                </div>

                {vagasFiltradas.length === 0 ? (
                    <p className={styles.message}>Não há vaga para este dia.</p>
                ) : (
                    <ul>
                        {vagasFiltradas.map(vaga => (
                            <li key={vaga.id}>
                                <button onClick={(event) => handleVagaSelection(event, vaga)}>
                                    {formatarData(vaga.dataHora)}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                
                <div className={styles.button_box}>
                    < CancelarWhiteButton />
                    <button className={styles.criar_button} onClick={handleReagendarVaga} disabled={!selectedVaga}>
                        Confirmar
                    </button>
                </div>
            </form>

            <Alert message="Reagendamento concluído com sucesso!" show={showAlert} url={`/agendamentosDia`} />
            {showErrorAlert && <ErrorAlert message="Erro ao realizar reagendamento, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default ReagendarConsulta;
