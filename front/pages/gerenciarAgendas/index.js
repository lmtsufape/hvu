import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarCronogramas from "../../src/components/GerenciarCronogramas";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GerenciarCronogramasPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader/>
            <div className="flexStyle">
                < GerenciarCronogramas />
            </div>
            < Footer />
        </div>

    );
}

export default GerenciarCronogramasPage;
