import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "@/components/Lapa/Footer";
import GerenciarOrgaos from "@/components/Lapa/CadastrosGerais/Orgao/gerenciarOrgaos";

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
