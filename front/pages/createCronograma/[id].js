import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateCronograma from "../../src/components/CreateCronograma";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function CreateCronogramaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < CreateCronograma />
            </div>
            < Footer />
        </div>
    );
}

export default CreateCronogramaPage;