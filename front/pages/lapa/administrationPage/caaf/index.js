import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import GerenciaCaaf from "@/components/Lapa/Administration/AdmCAAF";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function GerenciaCaafPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <GerenciaCaaf />
            <Footer />
        </div>
    );
}

export default GerenciaCaafPage;
 