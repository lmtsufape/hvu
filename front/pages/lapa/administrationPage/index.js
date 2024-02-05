import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import TelaAdministracao from "@/components/Lapa/Administration";

function AdministrationPage() {
    return (
        <div>
            <Header03 />
            <TelaAdministracao />
            <Footer />
        </div>
    );
}

export default AdministrationPage;
