import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import CreatePatologistaCadastroForm from "@/components/Lapa/CreatePatologista";

function PageCadastroPatologista(){
    return(
        <div>
            <Header03/>
            <CreatePatologistaCadastroForm/>
            <Footer/>
        </div>
    )
}

export default PageCadastroPatologista;
