import React from 'react'
import styles from './components/footer.module.css'
import Image from 'next/image'

function Footer() {
    return (
      <footer className={styles.backgroundfooter}>
        <div className={styles.footercontainer}>
            <div className={styles.logohvu}>
            <Image src="/layouts/HVUlogo.svg" alt="Logo" width={159.38} height={36}/>
            </div>
            <div  className={styles.logosufapelmts}>
            <Image src="/layouts/UFAPElogo.svg" alt="Logo" width={182.31} height={57.78} />
            <Image src="/layouts/LMTSlogo.svg" alt="Logo" width={182.31} height={57.78} />
            </div>
            <div className={styles.redessociais}>
            <Image src="/layouts/email.svg" alt="Logo" width={50} height={25} />
            </div>
            <div className={styles.redessociais}>
            <Image src="/layouts/facebook.svg" alt="Logo" width={50} height={25} />
            </div>
            <div className={styles.redessociais}>
            <Image src="/layouts/instagram.svg" alt="Logo" width={50} height={25} />
            </div>
            
        </div>
      </footer>
    );
  }
  

export default Footer;
