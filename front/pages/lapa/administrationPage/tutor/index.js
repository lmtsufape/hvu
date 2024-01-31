import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaTutor from "@/components/Lapa/Administration/AdmTutores";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaTutorPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaTutor />
            <Footer />
        </div>
    );
}

export default GerenciaTutorPage;
 