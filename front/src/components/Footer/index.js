import React from 'react'
import styles from './index.module.css'
import Image from 'next/image'

function Footer() {
    return (
      <footer className={styles.backgroundfooter}>
        <div className={styles.footercontainer}>
            <div className={styles.logohvu}>
                <a href="http://ufape.edu.br/hvu" target="blank" rel="noopener">
                    <Image src="./images/HVUlogo.svg" alt="Logo HVU" width={159.38} height={100} className={styles.hvu_logo}/>
                </a>
            </div>
            <div  className={styles.logosufapelmts}>
                <a href="http://ufape.edu.br/" target="blank" rel="noopener">
                    <Image src="./images/UFAPElogo.svg" alt="Logo LMTS" width={122.31} height={80} className={styles.lmts_logo}/>
                </a>
                <a href="http://lmts.ufape.edu.br" target="blank" rel="noopener">
                    <Image src="./images/LMTSlogo.svg" alt="Logo UFAPE" width={122.31} height={65} className={styles.ufape_logo}/>
                </a>
            </div>
            <div className={styles.redessociais}>
                <a href="mailto:lmts@ufape.edu.br" target="blank" rel="noopener">
                    <Image src="./images/email.svg" alt="Email" width={50} height={25} />
                </a>
                <a href="https://www.instagram.com/lmts_ufape/" target="blank" rel="noopener">
                    <Image src="./images/instagram.svg" alt="Instagram" width={50} height={25} />
                </a>
                <a href="https://pt-br.facebook.com/LMTSUFAPE/" target="blank" rel="noopener">
                    <Image src="./images/facebook.svg" alt="LMTS" width={50} height={25} />
                </a>
            </div>            
        </div>
      </footer>
    );
  }
  

export default Footer;
