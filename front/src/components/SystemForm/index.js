import React from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";

function SystemForm() {
  return (
    <div className={styles.page}>
      <VoltarButton />

      <div className={styles.container}>
        <div className={styles.titulo}>
          <h1> O Sistema</h1>
        </div>
        <div>
          <h6>
            Bem-vindo ao site dedicado à gestão do Hospital Universitário
            Veterinário &#40;HVU&#41; da Universidade Federal do Agreste de
            Pernambuco &#40;UFAPE&#41;.
          </h6>

          <h6>
            O sistema realiza o agendamento por tutores de animais que
            necessitem de atendimento nas diversas especialidades
            médico-veterinárias oferecidas no HVU. Além disso, ele gerencia os
            históricos de consultas, exames, cirurgias e tratamentos,
            simplificando o acesso aos dados de saúde do animal na ocasião de
            uma nova consulta e novos exames. Assim, a plataforma de gestão do
            HVU oferece uma interface clara e transparente ao usuário, a fim de
            contribuir para uma maior rapidez e eficiência no atendimento.
          </h6>
          <div className={`text-center pt-2`}>
            <h4 className="mb-3">Equipe de Desenvolvimento</h4>
            <ul className={`list-group list-group-flush`}>
              {[
                "Caio Vinícius dos Santos Gama",
                "Douglas Ranyery Silva Leite Morais",
                "Genildo Burgos Barros",
                "Gustavo Ferreira Wanderley",
                "Igor Daniel da Costa Silva",
                "Inês Alessandra Alves de Melo",
                "João Victor Cordeiro da Silva",
                "Luann Bento Ferreira",
                "Luis Felipe de Oliveira Andrade",
                "Magno Sillas Nunes Ramos Gomes",
                "Marcos Venício Silva do Nascimento",
                "Rafaela Foerster de Menezes",
                "Ricaelle Nascimento Teixeira Pontes",
                "Rogério Lacerda dos Santos",
                "Thiago Araujo Barbosa",
              ].map((nome, index) => (
                <li key={index} className="list-group-item">
                  {nome}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemForm;
