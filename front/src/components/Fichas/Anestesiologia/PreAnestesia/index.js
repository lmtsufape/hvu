import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import { useState } from "react";

import VoltarButton                   from "@/components/VoltarButton";
import { CancelarWhiteButton }        from "@/components/WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

/* listas fixas */
const EXAMES = ["Ht","Pt","Alb","Plaq","FA","Leuc","ALT","Creat"];
const ESTADOS = ["Alerta","Tranquilo","Deprimido","Excitado","Agressivo"];
const DORES   = ["Sem dor","Leve","Moderada","Severa"];
const DESIDRATACAO = ["Normal","6 a 8%","8 a 10%","Acima de 10%"];
const MUCOSAS = ["Róseas", "Róseas pálidas", "Porcelanas", "Hiperêmicas", "Cianóticas", "Ictéricas", "Não avaliado"];
const SEDACAO = ["Nenhuma", "Leve", "Moderado", "Intenso"];



export default function PreAnestesia({
  formData,
  handleChange,
  handleCheckboxChange,
  nextStep
}) {
    const [localizacao, setLocalizacao] = useState({
        "Róseas": "",
        "Róseas pálidas": "",
        "Porcelanas": "",
        "Hiperêmicas": "",
        "Cianóticas": "",
        "Ictéricas": "",
        "Não avaliado": ""
      });
    

  const submitLocal = (e) => {
    e.preventDefault();
    nextStep();
  };

/* logo depois do submitLocal ---------------------------------- */
const handleLocalizacaoChange = (e, mucosa) => {
    const { value } = e.target;
    
    // grava o texto digitado no objeto localizacao
    setLocalizacao(prev => ({
    ...prev,
    [mucosa]: value            // atualiza só a linha da mucosa clicada
    }));
};
const [farmacos, setFarmacos] = useState(
  Array.from({ length: 5 }, () => ({ farmaco: "", dose: "", via: "" }))
);

/* handler para alteração de cada célula */
const handleFarmacoChange = (idx, field, value) => {
  setFarmacos((prev) => {
    const copy = structuredClone(prev);
    copy[idx][field] = value;
    return copy;
  });
};

/* adiciona nova linha em branco */
const addFarmacoRow = () => {
  setFarmacos((prev) => [...prev, { farmaco: "", dose: "", via: "" }]);
};

/* remove linha */
const removeFarmacoRow = (idx) => {
  setFarmacos((prev) => prev.filter((_, i) => i !== idx));
};

  return (
    <div className={styles.container}>
      <VoltarButton />

      <h1 className="text-center mb-4">Ficha de Anestesiologia Pré-Anestesia</h1>

      <form onSubmit={submitLocal}>

        {/* Cirurgião ------------------------------------------------------- */}
        <div className="mb-3">
          <label className="">Cirurgião</label>
          <input
            name="pre.cirurgiao"
            value={formData.pre?.cirurgiao || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Exames laboratoriais ------------------------------------------- */}
        <fieldset className="mb-3">
          <label className=" mb-2">Exames laboratoriais</label>

          {/* linha flexível de checkboxes */}
          <div className="d-flex flex-wrap gap-4 align-items-center">
            {EXAMES.map((ex) => (
              <label key={ex} className="form-check form-check-inline m-0">
                <input
                  type="checkbox"
                  className="form-check-input me-1"
                  value={ex}
                  checked={formData.pre?.exames?.includes(ex) || false}
                  onChange={(e) => handleCheckboxChange(e, "pre.exames")}
                />
                <span className="form-check-label">{ex}</span>
              </label>
            ))}
          </div>

          {/* campo Outros */}
          <div className="mt-3">
            <label className="form-label mb-1">Outros</label>
            <textarea
              rows={2}
              className="form-control"
              name="pre.examesOutros"
              value={formData.pre?.examesOutros || ""}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {/* Avaliação pré-anestésica --------------------------------------- */}
        <h5 className="bg-success-subtle p-2 rounded">Avaliação Pré-Anestésica</h5>

        <div className="row mb-3">
          <div className="col-md-3">
            <label>Hora
              <input
                type="time"
                className="form-control"
                name="pre.hora"
                value={formData.pre?.hora || ""}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Estado</label><br/>
          {ESTADOS.map(s => (
            <label key={s} className="me-3">
              <input
                type="radio"
                name="pre.estado"
                value={s}
                checked={formData.pre?.estado === s}
                onChange={handleChange}
              /> {s}
            </label>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Dor</label><br/>
          {DORES.map(d => (
            <label key={d} className="me-3">
              <input
                type="radio"
                name="pre.dor"
                value={d}
                checked={formData.pre?.dor === d}
                onChange={handleChange}
              /> {d}
            </label>
          ))}
        </div>

        {/* Sinais vitais --------------------------------------------------- */}
        <div className="row mb-3">
          <div className="col">
            <label>Temperatura
              <input
                type="number"
                step="0.1"
                className="form-control"
                name="pre.temperatura"
                value={formData.pre?.temperatura || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="col">
            <label>Jejum
              <input
                type="text"
                className="form-control"
                name="pre.jejum"
                value={formData.pre?.jejum || ""}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <label>Frequência Cardíaca (BPM)
              <input
                type="number"
                className="form-control"
                name="pre.fc"
                value={formData.pre?.fc || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="col">
            <label>Pressão arterial
              <input
                type="text"
                className="form-control"
                name="pre.pa"
                value={formData.pre?.pa || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="col">
            <label>Frequência Respiratória (RPM)
              <input
                type="number"
                className="form-control"
                name="pre.fr"
                value={formData.pre?.fr || ""}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Grau de Desidratação:</label><br/>
          {DESIDRATACAO.map(s => (
            <label key={s} className="me-3">
              <input
                type="radio"
                name="pre.estado"
                value={s}
                checked={formData.pre?.estado === s}
                onChange={handleChange}
              /> {s}
            </label>
          ))}
        </div>


        {/* ­­­­­­­­­­­­­­­­­­­­­ Turgor cutâneo _____________________________________ */}
        <div className="col-md-6 mb-3">
        <label className="form-label fw-medium">Turgor cutâneo</label>
        <select
            className="form-select"
            name="pre.turgor"                        
            value={formData.pre?.turgor || ""}
            onChange={handleChange}
        >
            <option value="">Selecione…</option>
            <option value="NORMAL">NORMAL</option>
            <option value="REDUZIDO">REDUZIDO</option>
        </select>
        </div>

        {/* TPC ---------------------------------------------------------- */}
        <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">TPC (s)</label>
            <select
                className="form-select"
                name="pre.tpc"                     /* grava em formData.pre.tpc */
                value={formData.pre?.tpc || ""}
                onChange={handleChange}
            >
                <option value="">Selecione…</option>
                {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                    {i + 1}
                </option>
                ))}
            </select>
        </div>


        <div className="row fw-medium mb-2">
        <div className="col-3 mb-3 mt-4">Mucosas</div>
        <div className="col mt-4 mb-3">
          Localização (oculopalpebral, nasal, bucal, vulvar, prepucial ou anal)
        </div>
            {MUCOSAS.map((mucosa) => (
            <div key={mucosa} className="row align-items-start mb-2">
              {/* coluna do checkbox + rótulo */}
              <div className="col-3">
                <label className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    name={`pre.mucosas.${mucosa}`}
                    value={mucosa}
                    checked={formData.pre?.mucosas?.includes(mucosa) || false}
                    onChange={(e) => handleCheckboxChange(e, "pre.mucosas")}
                    className="me-2"
                  />
                  {mucosa}
                </label>
              </div>

                {/* campo de localização */}
                <div className="col">
                <input
                  type="text"
                  className="form-control"
                  value={localizacao[mucosa]}
                  onChange={(e) => handleLocalizacaoChange(e, mucosa)}
                  disabled={!formData.pre?.mucosas?.includes(mucosa)}
                />
              </div>
            </div>
            ))}


            {/* Medicação Pré-Anestésica --------------------------------------- */}
            <h5 className="bg-success-subtle p-2 rounded mt-4 mb-4">Medicação Pré-Anestésica</h5>
            
            <div className="row align-items-center mb-3">
              {/* Hora ----------------------------------------------------------- */}
              <div className="col-md-3">
                <label className="form-label fw-medium w-100">
                  Hora
                  <input
                    type="time"
                    className="form-control"
                    name="pre.hora2"
                    value={formData.pre?.hora2 || ""}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* coluna das opções de sedação */}
              <div className="col-md-9">
                {/* rótulo na 1ª linha */}
                <label className="form-label fw-medium mb-2 d-block">
                  Sedação:
                </label>

                {/* opções na 2ª linha */}
                <div className="d-flex align-items-center flex-wrap">
                  {SEDACAO.map((opt) => (
                    <label
                      key={opt}
                      className="me-4 d-inline-flex align-items-center mb-1"
                    >
                      <input
                        type="radio"
                        name="pre.sedacao"
                        value={opt}
                        checked={formData.pre?.sedacao === opt}
                        onChange={handleChange}
                        className="me-1"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              </div>

              <table className="table table-bordered">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: "55%" }}>Fármaco</th>
                    <th style={{ width: "25%" }}>Dose/Volume</th>
                    <th style={{ width: "15%" }}>Via</th>
                    <th style={{ width: "5%" }}></th>
                  </tr>
                </thead>

                <tbody>
                  {farmacos.map((row, idx) => (
                    <tr key={idx}>
                      {/* Fármaco ------------------------------------------------ */}
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.farmaco}
                          onChange={(e) => handleFarmacoChange(idx, "farmaco", e.target.value)}
                        />
                      </td>

                      {/* Dose / Volume ---------------------------------------- */}
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.dose}
                          onChange={(e) => handleFarmacoChange(idx, "dose", e.target.value)}
                        />
                      </td>

                      {/* Via --------------------------------------------------- */}
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.via}
                          onChange={(e) => handleFarmacoChange(idx, "via", e.target.value)}
                        />
                      </td>

                      {/* Remover linha ---------------------------------------- */}
                      <td className="text-center align-middle">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFarmacoRow(idx)}
                          disabled={farmacos.length === 1}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            
              <div className="text-center mb-3"> 
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={addFarmacoRow}
              >
                + Adicionar linha
              </button>
              </div>

              {/* --------------- AINES e Antibiótico – lado a lado --------------- */}
              <div className="row mb-3">
                {/* AINES */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    AINES&nbsp;<small>(fármaco e hora)</small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="pre.aines"
                    value={formData.pre?.aines || ""}
                    onChange={handleChange}
                   
                  />
                </div>

                {/* Antibiótico */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Antibiótico&nbsp;<small>(fármaco e hora)</small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="pre.antibiotico"
                    value={formData.pre?.antibiotico || ""}
                    onChange={handleChange}
                    
                  />
                </div>
              </div>

              {/* ------------------------ Outros – largura total ------------------------ */}
              <div className="mb-3">
                <label className="form-label fw-medium">Outros:</label>
                <input
                  type="text"
                  className="form-control"
                  name="pre.outros"
                  value={formData.pre?.outros || ""}
                  onChange={handleChange}
                  
                />
              </div>
            </div>


        {/* Botões ---------------------------------------------------------- */}
        <div className={styles.button_box}>
          <CancelarWhiteButton />
          <ContinuarFichasGreenButton type="submit" />
        </div>

      </form>
    </div>
  );
}
