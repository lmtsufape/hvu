import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader01} from "../../src/components/SubHeader";
import GetAnimalByIdForm from "../../src/components/GetAnimalById";
import Footer from "../../src/components/Footer";

function GetAnimalByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeader01 />
            < GetAnimalByIdForm />
            < Footer />
        </div>
    );
}

export default GetAnimalByIdPage;
