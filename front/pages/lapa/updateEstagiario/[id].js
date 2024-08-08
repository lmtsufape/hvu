import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import Footer from '@/components/Lapa/Footer';
import UpdateEstagiario from '@/components/Lapa/CadastrosGerais/Estagiario/UpdateEstagiario';

function UpdateEstagiarioPage() {
    
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < UpdateEstagiario />
            < Footer />
        </div>

    );
}

export default UpdateEstagiarioPage;
