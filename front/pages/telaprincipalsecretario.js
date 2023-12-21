import { Header03 } from "../src/components/Header";
import Footer from "../src/components/Footer";
import TelaSecretario from "../src/components/TelaPrincipalSecretario/telasecretario";
import { SubHeader02 } from "../src/components/SubHeader";

function TelaPrincipalSecretarioPage() {
    return (
        <>
        <div>
            < Header03 />
            < SubHeader02 />
            < TelaSecretario />
            < Footer />
        </div>

        </>
    );
}

export default TelaPrincipalSecretarioPage
