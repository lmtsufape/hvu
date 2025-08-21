import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

function TelaPrincipalAdminLapa() {
    const router = useRouter();
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");

    console.log("Roles:", roles);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
    }, []);

    if (!roles.includes("admin_lapa")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button
                    type="button"
                    className={styles.button} 
                    onClick={() => router.push('/lapa/gerenciarPatologistas/getAllPatologista')}>
                    <Image src="/andamento.svg" alt="Gerenciar patologistas" width={62} height={62}/>
                    <h6>Gerenciar Patologistas</h6>
                </button>          
            </div>
        </div>
    );
}

export default TelaPrincipalAdminLapa;
