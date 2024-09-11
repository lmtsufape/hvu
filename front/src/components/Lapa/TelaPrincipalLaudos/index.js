import React from 'react';
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

function TelaHomeLaudos() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button 
                    type="button"
                    className={styles.button}
                    onClick={() => router.push('/lapa/telaprincipallaudos/novaSolicitacao')}>
                    <Image src="/laudos.svg" alt="Criar Nova Solicitação" width={62} height={62}/>
                    <h6>Criar Nova Solicitação de Laudo</h6>
                </button>
                <button
                    type="button"
                    className={styles.button} 
                    onClick={() => router.push('/lapa/telaprincipallaudos/laudosEmAndamento')}>
                    <Image src="/andamento.svg" alt="Solicitações em Andamento" width={62} height={62}/>
                    <h6>Verificar Novas Solicitações</h6>
                </button>
                <button 
                    type="button"
                    className={styles.button}
                    onClick={() => router.push('/lapa/gerenciarLaudos')}>
                    <Image src="/necropsias_histopatologias.svg" alt="Necropsias e Histopatologias" width={62} height={62}/>
                    <h6>Necropsias e Histopatologias</h6>
                </button>          
            </div>
        </div>
    );
}

export default TelaHomeLaudos;
