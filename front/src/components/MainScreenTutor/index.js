import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";

function MainScreenTutor() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button className={styles.button} onClick={(e) => router.push("/meusAnimais")}>
                    <Image src="/pets.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Meus animais</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push("/meusAgendamentos")}>
                    <Image src="/calendar.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Meus agendamentos</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenTutor;
