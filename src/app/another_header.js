import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/another_header.css"

//Sem botão de relatório
export function SegundaHeader01 () {
    return (
        <div class="button_box">
            <button type="button" class="btn btn-link" id="button_decoration">Agendamentos</button>
            <button type="button" class="btn btn-link" id="button_decoration">Animais</button>
        </div>
    );
}

//Com botão de relatório
export function SegundaHeader02 () {
    return (
        <div class="button_box">
            <button type="button" class="btn btn-link" id="button_decoration">Agendamentos</button>
            <button type="button" class="btn btn-link" id="button_decoration">Animais</button>
            <button type="button" class="btn btn-link" id="button_decoration">Relatórios</button>
        </div>
    );
}

