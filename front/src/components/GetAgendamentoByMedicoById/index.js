import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import { getVagaById, updateVaga } from '../../../services/vagaService';
import VoltarButton from '../VoltarButton';
import { format } from 'date-fns';

function GetAgendamentoByMedicoById() {
    const router = useRouter();
    const { id } = router.query;
    const [vaga, setVaga] = useState({});
    const [finalizarModal, setFinalizarModal] = useState(false); // Estado para controlar o modal de finalização

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const vagaData = await getVagaById(id);
                    setVaga(vagaData);
                }
            } catch (error) {
                console.error('Erro ao buscar informações de vaga:', error);
            }
        };
        fetchData();
    }, [id]);

    const formatAnimalDateOfBirth = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatDate = (dataHora) => {
        if (typeof dataHora !== 'string') return ''; // Verifica se dataHora é uma string
        return format(new Date(dataHora.replace('T', ' ')), 'dd/MM/yyyy');
    };
    
    const formatHour = (dataHora) => {
        if (typeof dataHora !== 'string') return ''; // Verifica se dataHora é uma string
        return format(new Date(dataHora.replace('T', ' ')), 'HH:mm');
    };

    const handleFinalizarConsulta = async () => {
        try {
            // Atualiza o status da vaga para "Finalizado"
            const updatedVaga = { ...vaga, status: 'Finalizado' };
            await updateVaga(updatedVaga);
            setVaga(updatedVaga); // Atualiza o estado local da vaga
            setFinalizarModal(false); // Fecha o modal após finalizar
            router.push(`/agendamentosByMedico/${vaga.medico.id}`)
        } catch (error) {
            console.error('Erro ao finalizar agendamento:', error);
            // Lidar com erro aqui
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton/>
            <h1>Informações do agendamento</h1>
            <div className={styles.infos_box}>
                {vaga && (
                    <ul>
                        <li className={styles.item}>
                            <div className={styles.animal_dados}>
                                <div className={styles.identificacao}>
                                    <div className={styles.nome_animal}>Agendamento</div>
                                </div>
                                <div className={styles.form}>
                                    <div className={styles.box}>
                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Data</h6>
                                                <p>{formatDate(vaga.dataHora)}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Tipo de consulta</h6>
                                                <p>{vaga.tipoConsulta && vaga.tipoConsulta.tipo}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Horário</h6>
                                                <p>{formatHour(vaga.dataHora)}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Veterinário(a)</h6>
                                                <p>{vaga.medico && vaga.medico.nome}</p>
                                            </div>
                                        </div>

                                        <div className={styles.lista}>
                                            <div className={styles.infos}>
                                                <h6>Status</h6>
                                                <p>{vaga.status}</p>
                                            </div>
                                            <div className={styles.infos}>
                                                <h6>Especialidade</h6>
                                                <p>{vaga.especialidade && vaga.especialidade.nome}</p>
                                            </div>
                                        </div>

                                        <div className={styles.button_box}>
                                            <button className={styles.finalizar_button} onClick={() => setFinalizarModal(true)}>
                                                Finalizar consulta
                                            </button>
                                        </div>
                                        {finalizarModal && (
                                            <div className={styles.modal}>
                                                <div className={styles.box1}>
                                                    <div>Deseja finalizar a consulta?</div>
                                                    <button onClick={() => setFinalizarModal(false)} className={styles.button_close_modal}>X</button>
                                                </div>
                                                <div className={styles.box2}>
                                                    <button className={styles.cancelar_button} onClick={() => setFinalizarModal(false)}>Cancelar</button>
                                                    <button className={styles.excluir_button2} onClick={handleFinalizarConsulta}>Confirmar</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                )}

                {vaga.agendamento && (
                    <ul>
                        <li className={styles.item}>
                            <div className={styles.tutor_dados}>
                                <div className={styles.nome_animal}>Informações do paciente</div>
                                    <div className={styles.form}>
                                        <div className={styles.box}>
                                            <div className={styles.lista}>
                                                <div className={styles.infos}>
                                                    <h6>Nome do animal</h6>
                                                    <p>{vaga.agendamento && vaga.agendamento.animal && vaga.agendamento.animal.nome}</p>
                                                </div>
                                                <div className={styles.infos}>
                                                    <h6>Sexo</h6>
                                                    <p>{vaga.agendamento && vaga.agendamento.animal && vaga.agendamento.animal.sexo}</p>
                                                </div>
                                            </div>

                                            <div className={styles.lista}>
                                                <div className={styles.infos}>
                                                    <h6>Raça</h6>
                                                    <p>{vaga.agendamento && vaga.agendamento.animal && vaga.agendamento.animal.raca && vaga.agendamento.animal.raca.nome}</p>
                                                </div>
                                                <div className={styles.infos}>
                                                    <h6>Porte</h6>
                                                    <p>{vaga.agendamento && vaga.agendamento.animal && vaga.agendamento.animal.raca && vaga.agendamento.animal.raca.porte ? vaga.agendamento.animal.raca.porte : 'Não definido'}</p>
                                                </div>
                                            </div>

                                            <div className={styles.lista}>
                                                <div className={styles.infos}>
                                                    <h6>Data de nascimento</h6>
                                                    <p>{vaga.agendamento?.animal?.dataNascimento ? formatAnimalDateOfBirth(vaga.agendamento.animal.dataNascimento) : 'Não definida'}</p>
                                                </div>
                                                <div className={styles.infos}>
                                                    <h6>Peso</h6>
                                                    <p>{vaga.agendamento && vaga.agendamento.animal && vaga.agendamento.animal.peso === 0 ? "Não definido" : vaga.agendamento && vaga.agendamento.animal && vaga.agendamento.animal.peso}</p>
                                                </div>
                                            </div>

                                            <div className={styles.button_box}>
                                                <button className={styles.visualizar_button} onClick={() => router.push(`/getAnimalByIdByMedico/${vaga.agendamento.animal.id}`)}>
                                                    Visualizar paciente
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </li>
                    </ul>
                )}

            </div>
        </div>
    );
}

export default GetAgendamentoByMedicoById;
