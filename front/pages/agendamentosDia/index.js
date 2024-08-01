import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader} from "../../src/components/SubHeader";
import GetAllAgendamentosDiaForm from "../../src/components/GetAllAgendamentoDiaForm";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GetAllAgendamentosDiaPage() {
    return (
        <div className='divPai'>
        < Header03 />      
        < SubHeader />
        <div className='flexStyle'>
        < GetAllAgendamentosDiaForm />
        </div> 
        < Footer />
    </div> 
    );
}

export default GetAllAgendamentosDiaPage;