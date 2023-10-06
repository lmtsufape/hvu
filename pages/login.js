const { default: FormularioLogin } = require("../components/formulariologin");
const { Header02 } = require("../components/header");
const { default: Text } = require("@/app/texto_login_page");

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
