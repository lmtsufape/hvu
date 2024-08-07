import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import Footer from '@/components/Lapa/Footer';
import UpdateOrgao from '@/components/Lapa/CadastrosGerais/Orgao/UpdateOrgao';

function UpdateOrgaoPage() {
    
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < UpdateOrgao />
            < Footer />
        </div>

    );
}

export default UpdateOrgaoPage;
