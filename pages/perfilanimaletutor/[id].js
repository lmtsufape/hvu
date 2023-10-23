import React from 'react';
import {Header03} from "../../src/components/Header/header";
import {SegundaHeader02} from "../../src/components/AnotherHeader/anotherHeader";
import InfosDoAnimalETutor from "../../src/components/PerfilDoAnimalSecretario/infos";
import Footer from "../../src/components/Footer/Footer";

function PerfilDoAnimalPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SegundaHeader02 />
        </div>
        <div>
            < InfosDoAnimalETutor />
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default PerfilDoAnimalPage