import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./proximasConsultasTutor.module.css";
import axios from 'axios';

function CancelarButton () {
    return(
        <button className={styles.cancelar}>
            Cancelar
        </button>
    );
}

export default CancelarButton