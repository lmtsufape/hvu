import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import GerenciarRacasList from "@/components/Lapa/CadastrosGerais/Raca/GerenciarRaca";
import Footer from "@/components/Lapa/Footer";

function GerenciarRacasPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarRacasList />
            < Footer />
        </div>

    );
}

export default GerenciarRacasPage;
