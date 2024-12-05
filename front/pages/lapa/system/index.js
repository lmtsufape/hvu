import React from "react";
import { Header02, Header03 } from "@/components/Lapa/Header";
import SystemForm from "@/components/Lapa/SystemFormLapa";
import Footer from "@/components//Lapa/Footer";
import "@/styles/styles.css";

function SystemPage() {
    return(
        <div className="divPai">
            < Header02 />
            <div className="flexStyle">
            < SystemForm />
            </div>
            < Footer />
        </div>
    );
}

export default SystemPage;
