import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./semana.module.css";
import axios from 'axios';
import NovoAgendamentoButton from "./novoAgendamentoButton";
import Filtro from "./filtro";
import IconeCalendario from './iconeCalendario';
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import {DataCompleta} from "./data";
import dataStyles from "./data.module.css";

function AgendamentosDaSemana () {

    const data = new Date();
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dias = [];

    // Popula o array "dias" com objetos de data para cada dia da semana
    for (let i = 0; i < 7; i++) {
        const dia = new Date(data);
        dia.setDate(data.getDate() - data.getDay() + i);
        dias.push(dia);
    }
    
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
                            {dias.map((dia, index) => (
                                <th key={index}>
                                    <div className={styles.coluna_l1}>
                                        <h6>{diasDaSemana[index]}</h6>
                                        <div className={dataStyles.data_completa}>
                                            {`${dia.getDate().toString().padStart(2, '0')}/${(dia.getMonth() + 1).toString().padStart(2, '0')}`}
                                        </div>
                                    </div>
                                </th>
                            ))}
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
