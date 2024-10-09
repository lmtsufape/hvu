import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import GerenciarLaudos from "@/components/Lapa/CadastrosGerais/Laudo/GerenciarLaudos";
import Footer from "@/components/Lapa/Footer";

function GerenciarLaudosPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarLaudos />
            < Footer />
        </div>

    );
}

export default GerenciarLaudosPage;
