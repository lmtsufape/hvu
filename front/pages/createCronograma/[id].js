import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateCronograma from "../../src/components/CreateCronograma";
import Footer from "../../src/components/Footer";

function CreateCronogramaPage() {
    return(
        <div>
            < Header03 />
            < SubHeader />
            < CreateCronograma />
            < Footer />
        </div>
    );
}

export default CreateCronogramaPage;