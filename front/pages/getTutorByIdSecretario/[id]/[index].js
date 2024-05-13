import React from 'react';
import {Header03} from "../../../src/components/Header";
import {SubHeader} from "../../../src/components/SubHeader";
import GetPacienteById from "../../../src/components/GetPacienteById";
import Footer from "../../../src/components/Footer";

function GetPacienteByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeader />
            < GetPacienteById />
            < Footer />
        </div>
    );
}

export default GetPacienteByIdPage;