import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./dia.module.css";
import dataStyles from "./data.module.css";
import axios from 'axios';
import NovoAgendamentoButton from "./novoAgendamentoButton"
import Filtro from './filtro';
import {DataCompleta} from './data';
import {DataCurta} from './data';
import {DiaDaSemana} from './data';
import IconeCalendario from './iconeCalendario';
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';

function AgendamentosDoDia () {

    const data = new Date();

    return (
        <div className={styles.pagina}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Agendamentos da semana</h1>
                    < Filtro />
                </div>

                <div className={styles.box}>
                    <div className={styles.itens_box_1}>
                        <p className={dataStyles.data_completa}>{DataCompleta(data)}</p>
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
                                <p className={dataStyles.dia_da_semana}>{DiaDaSemana(data)}</p>
                                <p className={dataStyles.curta}>{DataCurta(data)}</p>         
                            </div>
                        </th>
                    </tr>

                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>08:00</th>
                        <th className={styles.th}>
                            <button className={styles.botao}>
                                <div className={styles.interna}>
                                    <div>Theodore</div>
                                    <div>|</div>
                                    <div>Canino</div>
                                </div>
                                <div className={styles.outra}>Cardiologia</div>
                                <div className={styles.outra}>08:00 - 09:00</div>
                            </button>
                        </th>
                    </tr>
                        
                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>09:00</th>
                        <th className={styles.th}></th>
                    </tr>

                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>10:00</th>
                        <th className={styles.th}></th>
                    </tr>

                    <tr className={styles.linha}>
                        <th className={styles.coluna1}>11:00</th>
                        <th className={styles.th}></th>
                    </tr>
                </table>
                
            </div>
        </div>
    );
}

export default AgendamentosDoDia
