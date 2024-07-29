import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "../../src/components/SubHeader";
import MeusAnimaisList from "../../src/components/MeusAnimais";
import "@/styles/styles.css";

function MeusAnimaisPage() {
    return (
        <div className='divPai'>
            <div>
                < Header03 />
            </div>

            <div>
                < SubHeader />
            </div>

            <div className='divCentral'>
                < MeusAnimaisList />
            </div>

            <div>
                < Footer />
            </div>
        </div>
    );
}

export default MeusAnimaisPage;
