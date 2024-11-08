import React from 'react';
import Link from 'next/link';
import styles from './BarraBrasil.module.css';

function BarraBrasil() {
  return (
    <div id="barra-brasil" className={styles.barraBrasil}>
      <div className={styles.conteudoEscondido}>
        <a accessKey="1" href="#conteudo">Ir para o conteúdo</a>
      </div>
      <div className={styles.conteudoBarraBrasil}>
        <Link href="https://gov.br" legacyBehavior>
          <a className={styles.picGov} title="GovBR">gov.br</a>
        </Link>
        <nav id="menu-barra-brasil" className={styles.menuBarraBrasil}>
          <ul className={styles.listaBarraBrasil}>
            <li className={styles.espacador}></li>
            <li className={styles.listItem}>
              <Link href="http://www.gov.br/secom/pt-br/acesso-a-informacao/comunicabr" legacyBehavior>
                <a className={`${styles.linkBarra} ${styles.linkExternoBarra}`}>COMUNICA BR</a>
              </Link>
            </li>
            <li className={styles.espacador}></li>
            <li className={styles.listItem}>
              <Link href="http://www.gov.br/acessoainformacao/" legacyBehavior>
                <a className={`${styles.linkBarra} ${styles.linkExternoBarra}`}>ACESSO À INFORMAÇÃO</a>
              </Link>
            </li>
            <li className={styles.espacador}></li>
            <li className={styles.listItem}>
              <Link href="https://www.gov.br/pt-br/participacao-social/" legacyBehavior>
                <a className={`${styles.linkBarra} ${styles.linkExternoBarra}`}>PARTICIPE</a>
              </Link>
            </li>
            <li className={styles.espacador}></li>
            <li className={styles.listItem}>
              <Link href="http://www4.planalto.gov.br/legislacao/" legacyBehavior>
                <a className={`${styles.linkBarra} ${styles.linkExternoBarra}`}>LEGISLAÇÃO</a>
              </Link>
            </li>
            <li className={styles.espacador}></li>
            <li className={styles.listItem}>
              <Link href="http://www.gov.br/pt-br/orgaos-do-governo" legacyBehavior>
                <a className={`${styles.linkBarra} ${styles.linkExternoBarra}`}>ÓRGÃOS DO GOVERNO</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default BarraBrasil;
