import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import NovoLaudo from "@/components/Lapa/Administration/AdmLaudos/NovoLaudo";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";

function NovoLaudoPage() {
    return (
        <div>
            <Header03 />
            <SubHeaderGeral/>
            <NovoLaudo />
            <Footer />
        </div>
    );
}

export default NovoLaudoPage;