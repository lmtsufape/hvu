import React from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";

function ContatoForm() {
  return (
    <div className={styles.page}>
      <VoltarButton />
      <div className={styles.container}>
        <div className={styles.titulo}>
        <div class="alert alert-danger custom-alert" role="alert">
              <strong>Atenção:</strong> Dúvidas ou dificuldades de uso devem ser relatadas diretamente na recepção do Hospital Veterinário. Falhas técnicas deverão ser reportadas pelo e-mail: lmts@ufape.edu.br.
        </div>
            <h1> Contato</h1>
        </div>

        <div>
          <h5>Hospital Veterinário Universitário (HVU)</h5>
            <span>Universidade Federal do Agreste de Pernambuco - UFAPE</span>
            <br />
            <span>
              Avenida Bom Pastor, s/n.º, Bairro Boa Vista - CEP: 55292-270 -
              Garanhuns - PE
            </span>
            <br />
            <span>E-mail: direcao.hospveterinario@ufape.edu.br</span>
            <br />
            {
            /*
            <div className={styles.whatsapp_link}>
              <a
                href="https://chat.whatsapp.com/KX4qqcuMXVuFEMiDxTbklJ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsapp_button}
              >
                Acesse nosso grupo de suporte no WhatsApp
              </a>
            </div>
            */}
            <br />
            <h5>Laboratório Multidisciplinar de Tecnologias Sociais (LMTS)</h5>
            <span>Universidade Federal do Agreste de Pernambuco - UFAPE</span>
            <br />
            <span>Avenida Bom Pastor, s/n.º, Bairro Boa Vista - CEP: 55292-270 - Garanhuns - PE</span>
            <br />
            <span>Laboratório 16 B</span>
            < br/>
            <span>E-mail: lmts@ufape.edu.br</span>
          
        </div>
      </div>
    </div>
  );
}

export default ContatoForm;
