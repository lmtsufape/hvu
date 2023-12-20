import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import {SegundaHeader02} from "../../src/components/AnotherHeader/anotherHeader";
import GetAllTutorSecretarioForm from "@/components/GetAllTutorSecretarioForm";

function GetAllTutorSecretarioPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>

        <div>
            < SegundaHeader02 />
        </div>

        <div>
            < GetAllTutorSecretarioForm />
        </div>

        <div>
            < Footer />
        </div>
        </>
    );
}

export default GetAllTutorSecretarioPage;
