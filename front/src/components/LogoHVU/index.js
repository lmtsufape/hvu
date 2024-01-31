import React from 'react';
import Image from "next/image";
import styles from "./index.module.css"

export default function LogoHVU() {
    return (
        <Image src='/images/hvulogo.svg' alt='Logo HVU' width={159.38} height={100} className={styles.logo}/>
    );
}
