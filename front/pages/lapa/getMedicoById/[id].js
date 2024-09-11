import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import Footer from '@/components/Lapa/Footer';
import VisualizarMedico from '@/components/Lapa/CadastrosGerais/Medico/VisualizarMedico';

function GetFichaByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeaderGeral />
            < VisualizarMedico />
            < Footer />
        </div>
    );
}

export default GetFichaByIdPage;
