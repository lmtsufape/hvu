import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import GetFichaSolicitacaoById from '@/components/Lapa/GetFichaByID';
import Footer from '@/components/Lapa/Footer';

function GetFichaByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeaderGeral />
            < GetFichaSolicitacaoById />
            < Footer />
        </div>
    );
}

export default GetFichaByIdPage;
