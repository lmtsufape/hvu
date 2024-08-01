import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "../../src/components/SubHeader";
import MainScreenMedico from "../../src/components/MainScreenMedico";
import "@/styles/styles.css";

function MainMedicoPage() {
    return (
        <>
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <MainScreenMedico />
            </div>
            < Footer />
        </div>

        </>
    );
}

export default MainMedicoPage;
