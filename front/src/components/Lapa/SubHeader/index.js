import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router"; 
import { getCurrentUsuario } from '../../../../services/userService';

//Administração Geral 
export function SubHeaderGeral () {
    const router = useRouter();
    const [userData, setUserData] = useState({ roles: [] });

    useEffect(() => {
        async function fetchUser() {
            const data = await getCurrentUsuario();
            setUserData(data || { roles: [] });
        }
        fetchUser();
    }, []);

    const handleHomeLaudosClick = () => {
        router.push('/lapa/telaprincipallaudos');
    };
    const handleHomeAdminLapaClick = () => {
        router.push('/lapa/homeAdmin');
    };
    const handleGeralClick = () => {
        router.push('/lapa/cadastrosGerais');
    };
 
    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} 
            onClick={userData.roles && Array.isArray(userData.roles) && userData.roles.includes("patologista") ? 
            handleHomeLaudosClick : handleHomeAdminLapaClick}>
                Home
            </button>
            {userData.roles && Array.isArray(userData.roles) && userData.roles.includes("patologista") && (
                <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleGeralClick}>
                    Cadastros Gerais
                </button>
            )}
        </div>
    );
}

//Administração de Animais
export function SubHeaderAnimal () {
    const router = useRouter();

    const handleAgendamentosClick = () => {
        router.push('/');
    };

    const handleAnimaisClick = () => {
        router.push('/');
    };

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAgendamentosClick}>Cadastrar</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAnimaisClick}>Remover</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAnimaisClick}>Editar</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAnimaisClick}>Vizualizar</button>
        </div>
    );
}

 
