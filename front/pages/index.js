import FormularioLogin from "../src/components/FormularioLogin/formulariologin";
import { Header02 } from "../src/components/Header/header";
import Text from "../src/components/TextoLogin/texto_login_page";
import styles from "../src/components/FormularioLogin/login.module.css";
import Footer from "@/components/Footer/Footer";

function PageLogin() {
    return (
        <>
        <div>
            < Header02 />
        </div>

        <div className={styles.container}>
            <div className={styles.container_box}>
                <div className={styles.text_box}>
                    < Text />
                </div>

                <div className={styles.form_box}>
                    <h1>Entrar</h1>
                    <forms>
                        < FormularioLogin/>
                    </forms>
                </div>
            </div>
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default PageLogin
