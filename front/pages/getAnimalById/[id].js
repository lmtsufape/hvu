import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader} from "../../src/components/SubHeader";
import GetAnimalByIdForm from "../../src/components/GetAnimalById";
import Footer from "../../src/components/Footer";

function GetAnimalByIdPage() {
    return (
        <div className='divPai'>
            < Header03 />
            < SubHeader />
            < GetAnimalByIdForm />
            < Footer />
        </div>
    );
}

export default GetAnimalByIdPage;
