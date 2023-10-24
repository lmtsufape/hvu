import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./proximasConsultasTutor.module.css";
import axios from 'axios';
import CancelarButton from "./cancelarButton";

function ProximasConsultasTutor () {
    return (
        <container className={styles.container}>
            <form className={styles.box}>
                <div className={styles.titulo}>Próximas consultas</div>

                <ul>
                    <li className={styles.lista}>
                        <div className={styles.box_dados}>
                            <div className={styles.info_box}>
                                <h5>tipo_de_consulta</h5>
                                <h6>horário</h6>
                            </div>
                            <div className={styles.info_box}>
                                <h5>Paciente</h5>
                                <h6>nome_do_paciente</h6>
                            </div>
                        </div>
                        <div className={styles.botao}>
                            < CancelarButton />
                        </div>
                    </li>
                </ul>
            </form>

        
        </container>
    );
}

export default ProximasConsultasTutor
