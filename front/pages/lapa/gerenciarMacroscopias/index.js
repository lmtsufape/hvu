import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "@/components/Lapa/Footer";
import GerenciarCampoLaudo from "@/components/Lapa/CadastrosGerais/Macroscopia/GerenciarMacroscopias";

function GerenciarCampoLaudoPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarCampoLaudo />
            < Footer />
        </div>

    );
}

export default GerenciarCampoLaudoPage;
