import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';

function Footer() {
    return (
      <footer className={styles.backgroundfooter}>
        <div className={styles.footercontainer}>
            <div className={styles.logohvu}>
                <a href="http://ufape.edu.br/hvu" target="blank" rel="noopener">
            <Image src="./images/HVUlogo.svg" alt="Logo" width={159.38} height={100}/>
            </a>
            </div>
                <div  className={styles.logosufapelmts}>
                    <a href="http://ufape.edu.br/" target="blank" rel="noopener">
                        <Image src="./images/UFAPElogo.svg" alt="Logo" width={122.31} height={80} />
                    </a>
                    <a href="http://lmts.ufape.edu.br" target="blank" rel="noopener">
                        <Image src="./images/LMTSlogo.svg" alt="Logo" width={122.31} height={65} />
                    </a>
                </div>
                <div className={styles.redessociais}>
                    <a href="mailto:lmts@ufape.edu.br" target="blank" rel="noopener">
                        <Image src="./images/email.svg" alt="Logo" width={50} height={25} />
                    </a>
                    <a href="https://www.instagram.com/lmts_ufape/" target="blank" rel="noopener">
                        <Image src="./images/instagram.svg" alt="Logo" width={50} height={25} />
                    </a>
                    <a href="https://pt-br.facebook.com/LMTSUFAPE/" target="blank" rel="noopener">
                        <Image src="./images/facebook.svg" alt="Logo" width={50} height={25} />
                    </a>
                </div>            
        </div>
      </footer>
    );
  }
  

export default Footer;
