import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header"
import Footer from "../../src/components/Footer"
import {SubHeader} from "../../src/components/SubHeader"
import MeusAnimaisList from "../../src/components/MeusAnimais"

function MeusAnimaisPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>

        <div>
            < SubHeader />
        </div>

        <div>
            < MeusAnimaisList />
        </div>

        <div>
            < Footer />
        </div>
        </>
    );
}

export default MeusAnimaisPage;
