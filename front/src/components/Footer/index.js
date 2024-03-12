import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';

function Footer() {
    return (
      <footer className={styles.backgroundfooter}>
            <div className={styles.logohvu}>
                <a href="http://ufape.edu.br/hvu" target="blank" rel="noopener">
            <Image src="/hvu_white_logo.svg" alt="Logo" width={150} height={40}/>
            </a>
            </div>
                <div  className={styles.logosufapelmts}>
                    <a href="http://ufape.edu.br/" target="blank" rel="noopener">
                        <Image src="/UFAPElogo.svg" alt="Logo" width={58} height={58} />
                    </a>
                    <a href="http://lmts.ufape.edu.br" target="blank" rel="noopener">
                        <Image src="/LMTSlogo.svg" alt="Logo" width={99} height={42} />
                    </a>
                </div>
                <div className={styles.redessociais}>
                    <a href="mailto:lmts@ufape.edu.br" target="blank" rel="noopener">
                        <Image src="/email.svg" alt="Logo" width={24} height={24} />
                    </a>
                    <a href="https://www.instagram.com/lmts_ufape/" target="blank" rel="noopener">
                        <Image src="/instagram.svg" alt="Logo" width={24} height={24} />
                    </a>
                    <a href="https://pt-br.facebook.com/LMTSUFAPE/" target="blank" rel="noopener">
                        <Image src="/facebook.svg" alt="Logo" width={27} height={27} />
                    </a>
                </div>            
      </footer>
    );
  }
  

export default Footer;
