import React from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
function SystemForm() {
    return(
        <div className={styles.page}>
            < VoltarButton />
            <div className={styles.container}>
                <h1>Sistema</h1>
                <div>
                    <h6>
                        Bem-vindo ao site dedicado à gestão do Hospital Universitário Veterinário (HVU) da Universidade Federal do Agreste de Pernambuco (UFAPE).
                    </h6> 

                    <h6>
                    O sistema realiza o agendamento por tutores de animais que necessitem de atendimento 
                    nas diversas especialidades médico-veterinárias oferecidas no HVU. Além disso, o sistema 
                    gerencia os históricos de consultas, exames, cirurgias e tratamentos, simplificando o acesso a
                    os dados de saúde do animal na ocasião de uma nova consulta e novos exames. Assim, o sistema de 
                    gestão do HVU oferece uma interface clara e transparente ao usuário, a fim de contribuir para uma maior 
                    rapidez e eficiência no atendimento.
                    </h6>

                </div>
            </div>
        </div>
    );
}

export default SystemForm;
