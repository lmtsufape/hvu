import { Header03 } from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import MainScreenTutor from "@/components/Lapa/CadastrosGerais/Tutor/MainTutor";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";

function MainSecretarioPage() {
    return (
        <>
        <div>
            < Header03 />
            <SubHeaderGeral />
            < MainScreenTutor />
            < Footer />
        </div>

        </>
    );
}

export default MainSecretarioPage;
