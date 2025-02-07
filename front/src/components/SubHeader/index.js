import {React, useState, useEffect, useRef} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";
import { getCurrentUsuario } from '../../../services/userService';

export function SubHeader() {
    const [subHeaderComponent, setSubHeaderComponent] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const sidebarRef = useRef(null);
    const menuButtonRef = useRef(null);

    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const loadSubHeaderComponent = async () => {
        try {
            const userData = await getCurrentUsuario();

            console.log("user:", userData)

            if (userData.roles && Array.isArray(userData.roles)) {
                if (userData.roles.includes("secretario")) {
                    setSubHeaderComponent(<SubheaderSecretario />);
                } else if (userData.roles.includes("medico")) {
                    setSubHeaderComponent(<SubheaderMedico medicoId={userData.usuario.id} />);
                } else if (userData.roles.includes("tutor")) {
                    setSubHeaderComponent(<SubHeaderTutor />);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadSubHeaderComponent();
    }, []); 


  // Detecta cliques fora do menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Se o menu estiver aberto e o clique não ocorrer no menu ou no botão de abertura, fecha o menu
            if (
                menuOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [menuOpen]);

     // Detecta swipe para a direita para abrir o menu
    useEffect(() => {
        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            touchStartX.current = touch.clientX;
            touchStartY.current = touch.clientY;
        };

        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            const diffX = touch.clientX - touchStartX.current;
            const diffY = touch.clientY - touchStartY.current;

            // Verifica se o movimento é horizontal
            if (!menuOpen && Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                setMenuOpen(true);
            }
        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
    
        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [menuOpen]);

    return (
        <div>
            {/* Botão para abrir o menu */}
            <div className={styles.menuButtonBar}>
                <button className={styles.menuButton} 
                    ref={menuButtonRef} 
                    onClick={(e) => {e.stopPropagation(); setMenuOpen(!menuOpen)}}>
                    <div>☰</div>
                </button>
            </div>

            {/* Menu Lateral */}
            <div className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`} ref={sidebarRef}>
                <button className={styles.closeButton} 
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >×</button>
                {subHeaderComponent}
            </div>
        </div>
    );
}

export function SubHeaderTutor () {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/mainTutor")}><span>Home</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAgendamentos")}><span>Agendamentos</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAnimais")}><span>Meus animais</span></button>
        </div>
    );
}

export function SubheaderSecretario() {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/mainSecretario')}><span>Home</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/agendamentosDia')}><span>Agendamentos</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/pacientesBySecretario')}><span>Pacientes</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/getAllMedicos')}><span>Veterinários&#40;as&#41;</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/gerenciarAgendas')}><span>Agendas</span></button>
          {/*  <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/gerenciarRacas')}>Raças</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/gerenciarEspecies')}>Espécies</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/gerenciarTiposConsulta')}>Tipos de consulta</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/gerenciarEspecialidades')}>Especialidades</button> */}
        </div>
    );
}

export function SubheaderMedico({medicoId}) {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/mainMedico')}><span>Home</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push(`/agendamentosByMedico/${medicoId}`)}><span>Agendamentos</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push(`/pacientesByMedico/${medicoId}`)}><span>Pacientes</span></button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push(`/getAllCronogramaByMedico/${medicoId}`)}><span>Agendas</span></button>
        </div>
    );
}

