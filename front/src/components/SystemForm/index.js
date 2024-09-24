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
                    <h6>Bem-vindo ao nosso site dedicado a gestão do Hospital Universitário Veterinário da Universidade Federal do Agreste de 
                    Pernambuco (UFAPE).</h6> 

                    <h6>Devido à crescente demanda por serviços veterinários, enfrentávamos desafios significativos em garantir o acesso dos tutores de animais
                    aos atendimentos oferecidos pela universidade. Apenas em 2022, registramos uma demanda de 6240 serviços, o que evidenciou a importância e 
                    a necessidade de uma abordagem mais eficiente para lidar com essa demanda.</h6>

                    <h6>Nosso objetivo foi superar esses desafios e melhorar a experiência de todos os envolvidos, tanto os tutores de animais quanto os profissionais de saúde.
                    Para isso, desenvolvemos uma ferramenta de agendamento online que simplifica e otimiza o processo de marcação de consultas e procedimentos
                    veterinários.</h6>

                    <h6>Ao utilizar nossa ferramenta de agendamento, os tutores de animais poderão visualizar de forma clara e transparente a disponibilidade de vagas, 
                    reduzindo assim o número de desistências e garantindo um atendimento mais eficiente e satisfatório para todos.</h6>

                    <h6>Estamos comprometidos em melhorar continuamente nossos serviços e garantir que os animais e seus tutores recebam o cuidado e atenção que merecem. 
                    Obrigado por fazer parte deste projeto e por sua confiança em nosso sistema de agendamento.</h6>
                </div>
            </div>
        </div>
    );
}

export default SystemForm;
