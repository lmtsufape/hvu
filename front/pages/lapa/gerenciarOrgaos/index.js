import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import GerenciarOrgaos from "@/components/Lapa/CadastrosGerais/Foto/GerenciarFotos";
import Footer from "@/components/Lapa/Footer";

function GerenciarOrgaosPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarOrgaos />
            < Footer />
        </div>

    );
}

export default GerenciarOrgaosPage;
