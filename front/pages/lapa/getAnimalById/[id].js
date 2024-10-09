import React from 'react';
import { Header03 } from '@/components/Lapa/Header'; 
import { SubHeaderGeral } from '@/components/Lapa/SubHeader'; 
import GetAnimalByIdForm from '@/components/Lapa/CadastrosGerais/Animal/GetAnimalById';
import Footer from '@/components/Lapa/Footer';

function GetAnimalByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeaderGeral />
            < GetAnimalByIdForm />
            < Footer />
        </div>
    );
}

export default GetAnimalByIdPage;
