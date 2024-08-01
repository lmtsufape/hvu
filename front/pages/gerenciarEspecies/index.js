import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarEspecies from "../../src/components/GerenciarEspecies";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GerenciarEspeciesPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader/>
            <div className="flexStyle">
            < GerenciarEspecies />
            </div>
            < Footer />
        </div>

    );
}

export default GerenciarEspeciesPage;
