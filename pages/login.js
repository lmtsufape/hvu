import {FormularioLogin} from "../src/app/components/formulariologin/formulariologin";
import { Header02 } from "../src/app/components/header/header";
import { Text } from "../src/app/components/textologinpage/texto_login_page";
import styles from "../src/app/components/formulariologin/login.module.css";
import Footer from "@/app/components/footer/Footer";

function PageLogin() {
    return (
        <>
        <div>
            <Header02 />
        </div>

        <div className={styles.container}>

            <div className={styles.text_box}>
                <Text />
            </div>

            <div className={styles.form_box}>
                <h1>Entrar</h1>
                <forms>
                    <FormularioLogin/>
                </forms>
            </div>
        </div>
        <div>
            <Footer />
        </div>

        </>
    );
}

export default PageLogin
