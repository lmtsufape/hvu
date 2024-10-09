import { Header03 } from "@/components/Lapa/Header";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import Footer from "@/components/Lapa/Footer";
import GerenciarMicroscopia from "@/components/Lapa/CadastrosGerais/Microscopia/GerenciarMicroscopia";

function GerenciarMicroscopiaPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral/>
            < GerenciarMicroscopia />
            < Footer />
        </div>

    );
}

export default GerenciarMicroscopiaPage;
