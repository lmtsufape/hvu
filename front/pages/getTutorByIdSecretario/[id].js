import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import GetTutorByIdForm from "../../src/components/GetTutorByIdSecretarioForm";
import Footer from "../../src/components/Footer";

function getAnimalTutorPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SubHeader02 />
        </div>
        <div>
            < GetTutorByIdForm />
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default getAnimalTutorPage;