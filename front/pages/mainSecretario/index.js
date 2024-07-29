import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import MainScreenSecretario from "../../src/components/MainScreenSecretario";
import { SubHeader } from "../../src/components/SubHeader";
import "@/styles/styles.css";

function MainSecretarioPage() {
    return (
        <div className='divPai'>
            < Header03 />
            < SubHeader />
            <div className='flexStyle'>
                < MainScreenSecretario />
            </div>
            < Footer />
        </div>
    );
}

export default MainSecretarioPage;
