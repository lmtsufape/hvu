import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import {SubHeader02} from "../../src/components/SubHeader";
import GetAllTutorSecretarioForm from "../../src/components/GetAllTutorSecretarioForm";

function GetAllTutorSecretarioPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>

        <div>
            < SubHeader02 />
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
