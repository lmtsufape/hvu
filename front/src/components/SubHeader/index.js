import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";
import { getCurrentUsuario } from '../../../services/userService';

//Sem botão de relatório
export function SubHeader01 () {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/mainTutor")}>Home</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAgendamentos")}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAnimais")}>Meus animais</button>
        </div>
    );
}

//Com botão de relatório
export function SubHeader02 () {
    const router = useRouter();

    const homeButton = async (e) => {
        e.preventDefault();
        try{
            const userData = await getCurrentUsuario();
            if(userData.roles && Array.isArray(userData.roles) && userData.roles.includes("secretario")){
                router.push('/mainSecretario');
            }else if(userData.roles && Array.isArray(userData.roles) && userData.roles.includes("medico")){
                router.push('/mainMedico');
            }
        }catch(error){
            console.log(error);
        }  
    }

    const agendamentosButton = async (e) => {
        e.preventDefault();
        try{
            const userData = await getCurrentUsuario();
            if(userData.roles && Array.isArray(userData.roles) && userData.roles.includes("secretario")){
                router.push('/agendamentosDia');
            }else if(userData.roles && Array.isArray(userData.roles) && userData.roles.includes("medico")){
                router.push(`/agendamentosByMedico/${userData.usuario.id}`);
            }
        }catch(error){
            console.log(error);
        }  
    }

    const pacientesButton = async (e) => {
        e.preventDefault();
        try{
            const userData = await getCurrentUsuario();
            if(userData.roles && Array.isArray(userData.roles) && userData.roles.includes("secretario")){
                router.push('/pacientesBySecretário');
            }else if(userData.roles && Array.isArray(userData.roles) && userData.roles.includes("medico")){
                router.push(`/pacientesByMedico/${userData.usuario.id}`);
            }
        }catch(error){
            console.log(error);
        }  
    }

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={homeButton}>Home</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={agendamentosButton}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={pacientesButton}>Pacientes</button>
            {/* <button type="button" className="btn btn-link" id={styles.button_decoration}>Relatórios</button> */}
        </div>
    );
}

