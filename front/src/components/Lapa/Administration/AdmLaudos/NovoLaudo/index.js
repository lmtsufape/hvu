import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import FichaSolicitacaoServicoList from "@/hooks/useFichaSolicitacaoList";
import VoltarButton from "@/components/Lapa/VoltarButton";
import { getToken, getRoles } from "../../../../../../services/userService";


function NovoLaudo() {
    const router = useRouter();

    const { fichas, error: fichasError} = FichaSolicitacaoServicoList();

    const [selectedFicha, setSelectedFicha] = useState(null);

    const [laudoData, setLaudoData] =  useState({
        fichaClinica: "",
        ficha: "",
        tipoMicroscopia: "",
        conclusao: "",
        fichaSolicitacaoServico: {id: null},
        campoLaudo: {id: null},
        laudoMicroscopia: {id: null},
        foto: {id: null},
        estagiario: {id: null}
    })

    const [errors, setErrors] = useState({
      fichaClinica: "",
      ficha: "",
      tipoMicroscopia: "",
      conclusao: "",
      fichaSolicitacaoServico: "",
      campoLaudo: "",
      laudoMicroscopia: "",
      foto: "",
      estagiario: ""
    })
    const roles = getRoles();
    const token= getToken();

    if (!token) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Faça login para acessar esta página.
            </h3>
        </div>
        );
    }

    if (!roles.includes("patologista")) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Você não tem permissão para acessar esta página.
            </h3>
        </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de envio do formulário aqui
    };

    
    return (
        <div className={styles.container}>
          <VoltarButton />
          <h1>LAUDO DE NECROPSIA / HISTOPATOLÓGICO</h1>
          <form className={styles.form_box} onSubmit={handleSubmit}>

            <div className="row">

              <div className="col">
                <label htmlFor="ficha" className="form-label">Ficha </label>
                <input 
                  type="text"n
                  className={`form-control ${errors.ficha ? "is-invalid" : ""}`}
                  name="ficha"
                  placeholder = "Insira a ficha"
                  value={laudoData.ficha}
                />
              </div>
              <div className="col">
                <label htmlFor="fichaClinica" className="form-label">Ficha Clinica</label>
                <input
                  type="text"
                  className={`form-control ${errors.tipoServico ? "is-invalid" : ""}`}
                  name="ficha clinica"
                  placeholder="Insira a ficha clinica"
                  value={laudoData.fichaclinica}
                  />
              </div>
              <div className="col">
                <label htmlFor="recebimento" className="form-label">Recebimento</label>
                <input
                  type="datetime-local"
                  className={`form-control ${errors.recebimento ? "is-invalid" : ""}`}
                  name="recebimento"
                  value={laudoData.recebimento ? laudoData.recebimento.slice(0, -1) : ''}
                  />
                {errors.dataHoraObito && <div className="invalid-feedback">{errors.dataHoraObito}</div>}
              </div>
            </div>

            <div className="row">
              <h2>Ficha Clinica</h2>
              <div className="col">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input 
                  type="text"
                  className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                  name="nome"
                  placeholder="Insira o nome do material"
                  value={laudoData.nome}
                />
              </div>
              <div className="col">
                <label htmlFor="especie" className="form-label">Espécie</label>
                <input
                  type="text"
                  className={`form-control ${errors.especie ? "is-invalid" : ""}`}
                  name="especie"
                  placeholder="Insira a espécie"
                  value={laudoData.especie}
                />
              </div>
              <div className="col">
                <label htmlFor="raca" className="form-label">Raça</label>
                <input
                  type="text"
                  className={`form-control ${errors.raca ? "is-invalid" : ""}`}
                  name="raca"
                  placeholder="Insira a raça"
                  value={laudoData.raca}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="procedencia" className="form-label">Procedência</label>
                <input 
                  type="text"
                  className={`form-control ${errors.procedencia ? "is-invalid" : ""}`}
                  name="procedencia"
                  placeholder="Insira a procedência"
                  value={laudoData.procedencia}
                />
              </div>
              <div className="col">
                <label htmlFor="idade" className="form-label">Idade</label>
                <input
                  type="text"
                  className={`form-control ${errors.idade ? "is-invalid" : ""}`}
                  name="idade"
                  placeholder="Insira a idade"
                  value={laudoData.idade}
                />
              </div>
              <div className="col">
                <label htmlFor="sexo" className="form-label">Sexo</label>
                <div>
                <input 
                  type="checkbox"
                  name="sexo"
                  value="Macho"
                  checked={laudoData.sexo === 'Macho'}
                /> Macho
                <input 
                  type="checkbox"
                  name="sexo"
                  value="Fêmea"
                  checked={laudoData.sexo === 'Fêmea'}
                /> Fêmea
                <input 
                  type="checkbox"
                  name="sexo"
                  value="Indefinido"
                  checked={laudoData.sexo === 'Indefinido'}
                /> Indefinido
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="castrado" className="form-label">Castrado</label>
                <div>
                <input 
                  type="checkbox"
                  name="castrado"
                  checked={laudoData.castrado}
                /> Castrado
              </div>
              <div className="col">
                <label htmlFor="peso" className="form-label">Peso (Kg)</label>
                <input
                  type="text"
                  className={`form-control ${errors.peso ? "is-invalid" : ""}`}
                  name="peso"
                  placeholder="Insira o peso"
                  value={laudoData.peso}
                />
              </div>
            </div>
            <div className="row">
              <h2>Tutor</h2>
              <div className="col">
                <label htmlFor="proprietario" className="form-label">Proprietário</label>
                <input
                  type="text"
                  className={`form-control ${errors.proprietario ? "is-invalid" : ""}`}
                  name="proprietario"
                  placeholder="Insira o nome do proprietário"
                  value={laudoData.proprietario}
                />
              </div>
              <div className="col">
                <label htmlFor="telefone" className="form-label">Telefone</label>
                <input
                  type="text"
                  className={`form-control ${errors.telefone ? "is-invalid" : ""}`}
                  name="telefone"
                  placeholder="Insira o telefone"
                  value={laudoData.telefone}
                />
              </div>
              <div className="col">
                <label htmlFor="endereco" className="form-label">Endereço</label>
                <input
                  type="text"
                  className={`form-control ${errors.endereco ? "is-invalid" : ""}`}
                  name="endereco"
                  placeholder="Insira o endereço"
                  value={laudoData.endereco}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="bairro" className="form-label">Bairro</label>
                <input
                  type="text"
                  className={`form-control ${errors.bairro ? "is-invalid" : ""}`}
                  name="bairro"
                  placeholder="Insira o bairro"
                  value={laudoData.bairro}
                />
              </div>
            </div>
            <div className="row">
            <h2>Clínico</h2>
              <div className="col">
                <label htmlFor="clinico" className="form-label">Clínico</label>
                <input
                  type="text"
                  className={`form-control ${errors.clinico ? "is-invalid" : ""}`}
                  name="clinico"
                  placeholder="Insira o nome do clínico"
                  value={laudoData.clinico}
                />
              </div>
              <div className="col">
                <label htmlFor="clinicoTelefone" className="form-label">Telefone do Clínico</label>
                <input
                  type="text"
                  className={`form-control ${errors.clinicoTelefone ? "is-invalid" : ""}`}
                  name="clinicoTelefone"
                  placeholder="Insira o telefone do clínico"
                  value={laudoData.clinicoTelefone}
                />
              </div>
              <div className="col">
                <label htmlFor="clinicoEndereco" className="form-label">Endereço do Clínico</label>
                <input
                  type="text"
                  className={`form-control ${errors.clinicoEndereco ? "is-invalid" : ""}`}
                  name="clinicoEndereco"
                  placeholder="Insira o endereço do clínico"
                  value={laudoData.clinicoEndereco}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="clinicoBairro" className="form-label">Bairro do Clínico</label>
                <input
                  type="text"
                  className={`form-control ${errors.clinicoBairro ? "is-invalid" : ""}`}
                  name="clinicoBairro"
                  placeholder="Insira o bairro do clínico"
                  value={laudoData.clinicoBairro}
                />
              </div>
            </div>
            </div>
            </div>

            <div className="row">
              <h2>Material</h2>
              <div className="col">
                <label htmlFor="material" className="form-label"></label>
                <div>
                  <input 
                    type="checkbox"
                    name="material"
                    value="CAAF"
                    checked={laudoData.material === 'CAAF'}
                  /> CAAF
                  <input 
                    type="checkbox"
                    name="material"
                    value="Fragmento de biópsia cirúrgica"
                    checked={laudoData.material === 'Fragmento de biópsia cirúrgica'}
                  /> Fragmento de biópsia cirúrgica
                  <input 
                    type="checkbox"
                    name="material"
                    value="Fragmentos de necropsia"
                    checked={laudoData.material === 'Fragmentos de necropsia'}
                  /> Fragmentos de necropsia
                  <input 
                    type="checkbox"
                    name="material"
                    value="Animal"
                    checked={laudoData.material === 'Animal'}
                  /> Animal
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="conservacao" className="form-label">Material conservado em</label>
                <div>
                  <input 
                    type="checkbox"
                    name="conservacao"
                    value="Câmara fria"
                    checked={laudoData.conservacao === 'Câmara fria'}
                  /> Câmara fria
                  <input 
                    type="checkbox"
                    name="conservacao"
                    value="Temperatura ambiente"
                    checked={laudoData.conservacao === 'Temperatura ambiente'}
                  /> Temperatura ambiente
                  <input 
                    type="checkbox"
                    name="conservacao"
                    value="Freezer"
                    checked={laudoData.conservacao === 'Freezer'}
                  /> Freezer
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="estadoConservacao" className="form-label">Estado de conservação</label>
                <div>
                  <input 
                    type="checkbox"
                    name="estadoConservacao"
                    value="Alterações PM moderadas"
                    checked={laudoData.estadoConservacao === 'Alterações PM moderadas'}
                  /> Alterações PM moderadas
                  <input 
                    type="checkbox"
                    name="estadoConservacao"
                    value="Alterações PM acentuadas"
                    checked={laudoData.estadoConservacao === 'Alterações PM acentuadas'}
                  /> Alterações PM acentuadas
                  <input 
                    type="checkbox"
                    name="estadoConservacao"
                    value="Alterações PM iniciais"
                    checked={laudoData.estadoConservacao === 'Alterações PM iniciais'}
                  /> Alterações PM iniciais
                  <input 
                    type="checkbox"
                    name="estadoConservacao"
                    value="Bom"
                    checked={laudoData.estadoConservacao === 'Bom'}
                  /> Bom
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label htmlFor="historicoClinico" className="form-label">Histórico clínico (incluindo resultados laboratoriais)</label>
                <textarea 
                  className={`form-control ${errors.historicoClinico ? "is-invalid" : ""}`}
                  name="historicoClinico"
                  value={laudoData.historicoClinico}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="diagnosticoClinico" className="form-label">Diagnóstico clínico</label>
                <textarea 
                  className={`form-control ${errors.diagnosticoClinico ? "is-invalid" : ""}`}
                  name="diagnosticoClinico"
                  value={laudoData.diagnosticoClinico}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="macroscopia" className="form-label">Macroscopia</label>
                <textarea 
                  className={`form-control ${errors.macroscopia ? "is-invalid" : ""}`}
                  name="macroscopia"
                  value={laudoData.macroscopia}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="microscopia" className="form-label">Microscopia</label>
                <textarea 
                  className={`form-control ${errors.microscopia ? "is-invalid" : ""}`}
                  name="microscopia"
                  value={laudoData.microscopia}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="diagnosticoPatologista" className="form-label">Diagnóstico(s) do Patologista</label>
                <textarea 
                  className={`form-control ${errors.diagnosticoPatologista ? "is-invalid" : ""}`}
                  name="diagnosticoPatologista"
                  value={laudoData.diagnosticoPatologista}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="comentarios" className="form-label">Comentários</label>
                <textarea 
                  className={`form-control ${errors.comentarios ? "is-invalid" : ""}`}
                  name="comentarios"
                  value={laudoData.comentarios}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="materialEnviado" className="form-label">Material enviado p/</label>
                <div>
                  <input 
                    type="checkbox"
                    name="materialEnviado"
                    value="Toxicologia"
                    checked={laudoData.materialEnviado === 'Toxicologia'}
                  /> Toxicologia
                  <input 
                    type="checkbox"
                    name="materialEnviado"
                    value="Bacteriologia"
                    checked={laudoData.materialEnviado === 'Bacteriologia'}
                  /> Bacteriologia
                  <input 
                    type="checkbox"
                    name="materialEnviado"
                    value="Virologia"
                    checked={laudoData.materialEnviado === 'Virologia'}
                  /> Virologia
                  <input 
                    type="checkbox"
                    name="materialEnviado"
                    value="Parasitologia"
                    checked={laudoData.materialEnviado === 'Parasitologia'}
                  /> Parasitologia
                  <input 
                    type="checkbox"
                    name="materialEnviado"
                    value="Micologia"
                    checked={laudoData.materialEnviado === 'Micologia'}
                  /> Micologia
                  <input 
                    type="checkbox"
                    name="materialEnviado"
                    value="Patologia clínica"
                    checked={laudoData.materialEnviado === 'Patologia clínica'}
                  /> Patologia clínica
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="patologistaCRMV" className="form-label">Patologista/CRMV</label>
                <input
                  type="text"
                  className={`form-control ${errors.patologistaCRMV ? "is-invalid" : ""}`}
                  name="patologistaCRMV"
                  placeholder="Insira o nome do patologista e o CRMV"
                  value={laudoData.patologistaCRMV}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="estagiarios" className="form-label">Estagiário(s)</label>
                <textarea 
                  className={`form-control ${errors.estagiarios ? "is-invalid" : ""}`}
                  name="estagiarios"
                  value={laudoData.estagiarios}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="tipoExame" className="form-label">Tipo de exame (preço)</label>
                <input
                  type="text"
                  className={`form-control ${errors.tipoExame ? "is-invalid" : ""}`}
                  name="tipoExame"
                  placeholder="Insira o tipo de exame e o preço"
                  value={laudoData.tipoExame}
                />
              </div>
            </div>


        </form>
        </div>
      );
      

}

export default NovoLaudo;