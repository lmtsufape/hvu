import React from 'react';
import { Header03 } from '@/components/Lapa/Header';
import { SubHeaderGeral } from '@/components/Lapa/SubHeader';
import Footer from '@/components/Lapa/Footer';
import UpdateLaudoForm from "@/components/Lapa/UpdateLaudo";

function UpdateLaudoPage() {
    
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < UpdateLaudoForm />
            < Footer />
        </div>

    );
}

export default UpdateLaudoPage;
