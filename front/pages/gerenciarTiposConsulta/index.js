import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarTiposConsulta from "../../src/components/GerenciarTiposConsulta";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GerenciarTiposConsultaPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader/>
            <div className="flexStyle">
            < GerenciarTiposConsulta />
            </div>
            < Footer />
        </div>

    );
}

export default GerenciarTiposConsultaPage;
