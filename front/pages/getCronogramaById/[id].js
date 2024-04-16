import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import GetCronogramaById from "../../src/components/GetCronogramaById";
import Footer from "../../src/components/Footer";

function GetCronogramaByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeader02 />
            < GetCronogramaById />
            < Footer />
        </div>
    );
}

export default GetCronogramaByIdPage;
