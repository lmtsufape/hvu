import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import GerenciarEspecialidades from "@/components/Lapa/CadastrosGerais/Especialidade/GerenciarEspecialidades";
import Footer from "@/components/Lapa/Footer";

function GerenciarEspecialidadesPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarEspecialidades />
            < Footer />
        </div>

    );
}

export default GerenciarEspecialidadesPage;
