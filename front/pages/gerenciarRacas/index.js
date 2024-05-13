import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarRacasList from "../../src/components/GerenciarRacas";
import Footer from "../../src/components/Footer";

function GerenciarRacasPage(){
    return(
        <div>
            < Header03 />
            < SubHeader/>
            < GerenciarRacasList />
            < Footer />
        </div>

    );
}

export default GerenciarRacasPage;
