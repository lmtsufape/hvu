import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import MainScreenTutor from "../../src/components/MainScreenTutor"
import { SubHeader } from "../../src/components/SubHeader";
import "@/styles/styles.css";

function MainSecretarioPage() {
    return (
        <div className='divPai'>
            < Header03 />
            < SubHeader />
            <div className='flexStyle'>
                < MainScreenTutor />
            </div>
            < Footer />
        </div>
    );
}

export default MainSecretarioPage;
