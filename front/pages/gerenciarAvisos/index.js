import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarAvisos from "../../src/components/GerenciarAvisos";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GerenciarAvisosPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader/>
            <div className="flexStyle">
            < GerenciarAvisos />
            </div>
            < Footer />
        </div>

    );
}

export default GerenciarAvisosPage;
