import React from 'react';
import {Header03} from "../../src/components/Header/header";
import {SegundaHeader01} from "../../src/components/AnotherHeader/anotherHeader";
import InfosDoAnimal from "../../src/components/PerfilDoAnimal/infosAnimal";
import Footer from "../../src/components/Footer/Footer";

function PerfilDoAnimalPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SegundaHeader01 />
        </div>
        <div>
            < InfosDoAnimal />
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default PerfilDoAnimalPage