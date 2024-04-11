import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import GetMedicoById from "../../src/components/GetMedicoById";
import Footer from "../../src/components/Footer";

function GetMedicoByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeader02 />
            < GetMedicoById />
            < Footer />
        </div>
    );
}

export default GetMedicoByIdPage;
