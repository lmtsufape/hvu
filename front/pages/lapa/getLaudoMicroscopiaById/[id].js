import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import GetLaudoMicroscopiaById from '@/components/Lapa/CadastrosGerais/LaudoMicroscopia/GetLaudoByID';
import Footer from '@/components/Lapa/Footer';
import VoltarButton from '@/components/Lapa/VoltarButton';

function GetFichaByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeaderGeral />
            < GetLaudoMicroscopiaById />
            < Footer />
        </div>
    );
}

export default GetFichaByIdPage;
