import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import { getVagaById, updateVaga } from '../../../services/vagaService';
import VoltarButton from '../VoltarButton';
import { format } from 'date-fns';
import { CriarConsulta, VisualizarPaciente } from '../WhiteButton';

function GetAgendamentoByMedicoById() {
    const router = useRouter();
    const { id } = router.query;
    const [vaga, setVaga] = useState({});
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    console.log("vaga:", vaga);

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
                if (id) {
                    const vagaData = await getVagaById(id);
                    setVaga(vagaData);
                }
            } catch (error) {
                console.error('Erro ao buscar informações de vaga:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
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
                                            <CriarConsulta page={'createConsulta'} id={id} />
                                        </div>
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
                                                <VisualizarPaciente page={'getAnimalByIdByMedico'} id={vaga.agendamento.animal.id} />
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
