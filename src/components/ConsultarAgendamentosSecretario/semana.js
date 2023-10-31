import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./semana.module.css";
import axios from 'axios';
import NovoAgendamentoButton from "./novoAgendamentoButton";
import Filtro from "./filtro";
import IconeCalendario from './iconeCalendario';
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import Data from "./data";

function AgendamentosDaSemana () {
    
    return (
        <div className={styles.pagina}>
            <div className={styles.container}>

                <div className={styles.header}>
                    <h1>Agendamentos da semana</h1>
                    < Filtro />
                </div>

                <div className={styles.box}>
                    <div className={styles.itens_box_1}>
                        < Data />
                        < IconeCalendario />
                    </div>
                    <div className={styles.itens_box_2}>
                        < CampoPesquisa />
                        < NovoAgendamentoButton />
                    </div>
                </div>

                <table className={styles.tabela}>
                    <tr className={styles.linha1}>
                        <th className={styles.coluna1_l1}></th>
                        <th>
                            <div className={styles.coluna_l1}>
                                <h6>Domingo</h6>
                                <div>Data</div>             
                            </div>
                        </th>
                        <th>
                            <div className={styles.coluna_l1}>
                                <h6>Segunda</h6>
                                <div>Data</div>             
                            </div>
                        </th>
                        <th>
                            <div className={styles.coluna_l1}>
                                <h6>Terça</h6>
                                <div>Data</div>             
                            </div>
                        </th>
                        <th>
                            <div className={styles.coluna_l1}>
                                <h6>Quarta</h6>
                                <div>Data</div>             
                            </div>
                        </th>
                        <th>
                            <div className={styles.coluna_l1}>
                                <h6>Quinta</h6>
                                <div>Data</div>             
                            </div>
                        </th>
                        <th>
                            <div className={styles.coluna_l1}>
                                <h6>Sexta</h6>
                                <div>Data</div>             
                            </div>
                        </th>
                        <th>
                            <div className={styles.coluna_l1}>
                                <h6>Sábado</h6>
                                <div>Data</div>             
                            </div>
                        </th>

                    </tr>

                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>08:00</th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                    </tr>
                        
                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>09:00</th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                    </tr>

                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>10:00</th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                    </tr>

                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>11:00</th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                        <th className={styles.th}></th>
                    </tr>
                </table>
                
            </div>
        </div>
    );
}

export default AgendamentosDaSemana