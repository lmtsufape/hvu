import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import GetLaudoNecropsiaById from '@/components/Lapa/CadastrosGerais/Laudo/GetLaudoByID';
import Footer from '@/components/Lapa/Footer';

function GetFichaByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeaderGeral />
            < GetLaudoNecropsiaById />
            < Footer />
        </div>
    );
}

export default GetFichaByIdPage;
