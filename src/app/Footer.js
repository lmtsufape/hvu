import React from 'react'
import styles from './components/footer.module.css'
import Image from 'next/image'

function Footer(){
    return(
        <footer className={styles.backgroundfooter}>
            <div>
                <h1>
                    Rodapé pra testar
                    </h1>
                <p>
                    Só pra testar
                    <ul>
                    <Image src="/layouts/LMTSlogo.png" alt="Logo" width={182} height={57}/>
                    <Image src="/layouts/UFAPElogo.png" alt="Logo" width={100} height={50}/>
                    <Image src="/layouts/email.svg" alt="Logo" width={100} height={50}/>
                    <Image src="/layouts/facebook.svg" alt="Logo" width={100} height={50}/>
                    <Image src="/layouts/instagram.svg" alt="Logo" width={100} height={50}/>
                    </ul>
                </p>
                
            </div>
        </footer>
    )
}

export default Footer;
