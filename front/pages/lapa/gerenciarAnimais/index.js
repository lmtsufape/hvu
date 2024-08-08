import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import GerenciarAnimaisList from "@/components/Lapa/CadastrosGerais/Animal/GerenciarAnimais";
import Footer from "@/components/Lapa/Footer";

function GerenciarRacasPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarAnimaisList />
            < Footer />
        </div>

    );
}

export default GerenciarRacasPage;
