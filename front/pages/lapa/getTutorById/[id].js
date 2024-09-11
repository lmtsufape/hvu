import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import Footer from '@/components/Lapa/Footer';
import VisualizarTutor from '@/components/Lapa/CadastrosGerais/Tutor/VisualizarTutor';

function GetFichaByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeaderGeral />
            < VisualizarTutor />
            < Footer />
        </div>
    );
}

export default GetFichaByIdPage;
