import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import GerenciarAreaList from "@/components/Lapa/CadastrosGerais/Area/GerenciarArea";
import Footer from "@/components/Lapa/Footer";

function GerenciarRacasPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarAreaList />
            < Footer />
        </div>

    );
}

export default GerenciarRacasPage;
