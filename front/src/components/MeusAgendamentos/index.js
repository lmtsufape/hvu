import styles from "@/components/MeusAgendamentos/index.module.css"
import { SubHeader01 } from "../SubHeader"
import Image from "next/image";

export default function MeusAgendamentos(){
    return(
        <div>
            <div className={styles.voltar}>
                <Image src="/images/IconMenorQue.svg" alt="Voltar" width={27} height={24}/>
                <h1>Voltar</h1>
            </div>
            <div className={styles.titleMeusAgendamentos}>
                <h1> Meus Agendamentos </h1>
            </div>
            <div className={styles.pesquisaBotao}>
                <input>
                </input>
                <div>
                    <Image src="/images/icone_busca_grey.svg" alt="Pesquisar" width={20} height={17}/>
                </div>
                    
                <button><h1>Criar agendamento</h1></button>
            </div>
            <div className={styles.agendamentos}>
            <div className={styles.agendamentoBox}>
                <div>
                    <h1> Consulta Clínica </h1>
                    <h2> 29/07 às 08:00 </h2>
                </div>
                <div>
                    <h1> Paciente </h1>
                    <h2> Maria Biscoita </h2>
                </div>
                <div>
                    <button>
                        <h1>Cancelar</h1>
                    </button>
                </div>
            </div>
            <div className={styles.agendamentoBox}>
                <div>
                    <h1> Consulta Clínica </h1>
                    <h2> 29/07 às 10:00 </h2>
                </div>
                <div>
                    <h1> Paciente </h1>
                    <h2> José Floquinho </h2>
                </div>
                <div>
                    <button>
                        <h1>Cancelar</h1>
                    </button>
                </div>
            </div>
            </div>
        </div>
    )
}