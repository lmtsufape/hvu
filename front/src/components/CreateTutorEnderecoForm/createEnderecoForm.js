import React, { useState } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createEnderecoForm.module.css";

function CreateEnderecoForm({ enderecoFormData, handleEnderecoChange, errors }) {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");

  const handleCEPChange = async (event) => {
    const cep = event.target.value;
    handleEnderecoChange(event); // Chama a função handleEnderecoChange para atualizar o estado com o valor do CEP

    if (cep.length === 9) { // Verifica se o CEP foi completamente preenchido
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const { localidade, uf, logradouro, bairro } = response.data;

        setCidade(localidade);
        setEstado(uf);
        setRua(logradouro);
        setBairro(bairro);

        // Atualiza o estado com os dados obtidos da API - cidade, estado, rua e bairro
        handleEnderecoChange({
          target: {
            name: "cidade",
            value: localidade
          }
        });

        handleEnderecoChange({
          target: {
            name: "estado",
            value: uf
          }
        });

        handleEnderecoChange({
          target: {
            name: "rua",
            value: logradouro
          }
        });

        handleEnderecoChange({
          target: {
            name: "bairro",
            value: bairro
          }
        });
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  return (
    <div className={styles.boxcadastrotutor}>
      <div className={styles.titulo}>Endereço</div>
      {renderInput("CEP", "cep", enderecoFormData.cep, handleCEPChange, "Ex: 55250-000", errors.cep, "text", "99999-999")}
      {renderInput("Número", "numero", enderecoFormData.numero, handleEnderecoChange, "Ex: 140", errors.numero)}
      <div className="mb-3">
        <div className="row">
          <div className="col">
            {renderInput("Rua", "rua", rua, handleEnderecoChange, "Ex: Avenida Bom Pastor", errors.rua)}
            {renderInput("Bairro", "bairro", bairro, handleEnderecoChange, "Ex: Centro", errors.bairro)}
          </div>
          <div className="col">
            {renderInput("Cidade", "cidade", cidade, handleEnderecoChange, "Ex: Garanhuns", errors.cidade)}
            {renderInput("Estado", "estado", estado, handleEnderecoChange, "Ex: Pernambuco", errors.estado)}
          </div>
        </div>
        <div className={styles.informacaoLAI}>
                <p>
                A <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" target="_blank" rel="noopener noreferrer">Lei nº 12.527/2011</a>, conhecida como Lei de Acesso à Informação - LAI, regulamenta o direito fundamental, previsto na Constituição, de qualquer pessoa física ou jurídica solicitar e receber informações públicas produzidas ou custodiadas pelos órgãos e entidades públicos. A LAI também garante o direito de acesso às informações produzidas ou custodiadas pelas entidades privadas sem fins lucrativos que recebam recurso público para a realização de ações de interesse público. 
                </p>
                <label>
                    <input
                            type="checkbox"
                            className={`form-check-input ${styles.checkbox}`}
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        Eu compreendo e aceito as condições da LAI.
                </label>
            </div>
      </div>
    </div>
  );
}

function renderInput(label, name, value, onChange, placeholder, error, type = "text", mask) {
  const InputComponent = mask ? InputMask : 'input';
  const inputProps = mask ? { mask } : {};

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
      <InputComponent
        type={type}
        className={`form-control ${styles.input} ${error ? 'is-invalid' : ''}`}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default CreateEnderecoForm;
