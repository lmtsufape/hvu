import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader} from "../../src/components/SubHeader";
import Footer from "../../src/components/Footer";
import GetAnimalByIdByMedico from '../../src/components/GetAnimalByIdByMedico';
import { SubHeaderGeral } from "../../src/components/Lapa/SubHeader";
import { getRoles } from "../../services/userService";

function GetAnimalByIdBymedicoPage() {
    const role = getRoles();
    
    return (
        <div>
            < Header03 />

            {role.includes("medico") ? (
                <SubHeader />
            ) : role.includes("patologista") ? (
                <SubHeaderGeral />
            ) : null}

            < GetAnimalByIdByMedico />
            < Footer />
        </div>
    );
}

export default GetAnimalByIdBymedicoPage;
