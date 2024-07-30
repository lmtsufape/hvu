import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import GerenciarFotos from "@/components/Lapa/CadastrosGerais/Foto/GerenciarFotos";
import Footer from "@/components/Lapa/Footer";

function GerenciarRacasPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarFotos />
            < Footer />
        </div>

    );
}

export default GerenciarRacasPage;
