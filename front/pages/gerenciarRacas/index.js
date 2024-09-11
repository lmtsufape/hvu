import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarRacasList from "../../src/components/GerenciarRacas";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GerenciarRacasPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader/>
            <div className="flexStyle">
                < GerenciarRacasList />
            </div>
            < Footer />
        </div>

    );
}

export default GerenciarRacasPage;
