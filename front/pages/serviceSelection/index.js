import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header01, Header02, Header04 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import ServiceSelection from "../../src/components/ServiceSelection";

function ServiceSelectionPage() {
    return (
        <div>
            <Header02 />
            <ServiceSelection />
            <Footer />
        </div>
    );
}

export default ServiceSelectionPage;
