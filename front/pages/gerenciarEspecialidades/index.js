import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarEspecialidades from "../../src/components/GerenciarEspecialidades";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GerenciarEspecialidadesPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader/>
            <div className="flexStyle">
                < GerenciarEspecialidades />
            </div>
            < Footer />
        </div>

    );
}

export default GerenciarEspecialidadesPage;
