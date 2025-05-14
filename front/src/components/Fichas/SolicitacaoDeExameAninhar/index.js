import React, { useState } from "react";
import styles from "./index.module.css";

function SolicitacaoDeExameAninhar({ formData, setFormData }) {
  const [otherValues, setOtherValues] = useState({
    hematologiaDiagnostica: "",
    urinalise: "",
    parasitologico: "",
    bioquimicaClinica: "",
    citologiaHistopatologia: "",
    imunologicos: "",
    imaginologia: "",
    cardiologia: "",
  });

  const [showOtherInput, setShowOtherInput] = useState({
    hematologiaDiagnostica: false,
    urinalise: false,
    parasitologico: false,
    bioquimicaClinica: false,
    citologiaHistopatologia: false,
    imunologicos: false,
    imaginologia: false,
    cardiologia: false,
  });

  const handleCheckboxChange = (event, field) => {
    const { value, checked } = event.target;

    setFormData((prev) => {
      const updatedField = checked
        ? [...prev.SolicitacaoDeExame[field], value]
        : prev.SolicitacaoDeExame[field].filter((item) => item !== value);

      return {
        ...prev,
        SolicitacaoDeExame: {
          ...prev.SolicitacaoDeExame,
          [field]: updatedField,
        },
      };
    });

    if (value === "Outros(s):") {
      setShowOtherInput((prev) => ({ ...prev, [field]: checked }));
      if (!checked) {
        setOtherValues((prev) => ({ ...prev, [field]: "" }));
        // Remove o valor personalizado ao desmarcar "Outros(s):"
        setFormData((prev) => ({
          ...prev,
          SolicitacaoDeExame: {
            ...prev.SolicitacaoDeExame,
            [field]: prev.SolicitacaoDeExame[field].filter(
              (item) => !prev.SolicitacaoDeExame[field].includes(item) || item === "Outros(s):"
            ),
          },
        }));
      }
    }
  };

  const handleOtherInputChange = (field, value) => {
    setOtherValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleOtherInputBlur = (field, value) => {
    setFormData((prev) => {
      const updatedField = prev.SolicitacaoDeExame[field].filter(
        (item) => item !== "Outros(s):"
      );
      if (value.trim() !== "") {
        updatedField.push(value.trim());
      }

      return {
        ...prev,
        SolicitacaoDeExame: {
          ...prev.SolicitacaoDeExame,
          [field]: updatedField,
        },
      };
    });
  };

  const examCategories = {
    hematologiaDiagnostica: [
      "Hemograma Parcial + Proteínas Plasmáticas Totais",
      "Proteínas Plasmáticas Totais",
      "Hemograma Parcial",
      "Hematócrito/Volume Globular",
      "Outros(s):",
    ],
    urinalise: ["Urinálise Completo", "Outros(s):"],
    parasitologico: ["Coproparasitológico", "Outros(s):"],
    bioquimicaClinica: [
      "Creatinina (CREA)",
      "Ureia (UR)",
      "ALT/TGP",
      "AST/TGO",
      "Fosfatase alcalina (FA)",
      "Gama - Glutamiltransferase (GGT)",
      "Bilirrubina total e frações (BT + BD + BI)",
      "Proteínas totais (PT)",
      "Albumina (ALB)",
      "Globulinas (GLOB)",
      "Triglicerides (TG)",
      "Colesterol Total (COL)",
      "Colesteróis HDL e LDL",
      "Glicose (GLI)",
      "Creatina quinase (CK/CPK)",
      "Outros(s):",
    ],
    citologiaHistopatologia: [
      "Citologia cutânea",
      "Raspado cutâneo",
      "Citologia oncológica",
      "Histopatológico",
      "Outros(s):",
    ],
    imunologicos: [
      "Teste rápido Cinomose",
      "Teste rápido Erliquiose",
      "Teste rápido Leishmaniose",
      "FIV/FELV",
      "Outros(s):",
    ],
    imaginologia: ["Ultrassonografia", "Radiografia", "Mielografia", "Outros(s):"],
    cardiologia: ["Eletrocardiograma", "Ecocardiograma", "Outros(s):"],
  };

  return (
    <div className={styles.form_box}>
      {Object.entries(examCategories).map(([field, options]) => (
        <div key={field}>
          <h2>
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace(/([A-Z])/g, " $1").trim()}
          </h2>
          <div className={styles.anamnesecontainer}>
            {options.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={formData[field]?.includes(item) || false}
                  onChange={(e) => handleCheckboxChange(e, field)}
                />
                {item}
              </label>
            ))}
          </div>
          {showOtherInput[field] && (
            <input
              type="text"
              placeholder="Digite aqui..."
              value={otherValues[field]}
              onChange={(e) => handleOtherInputChange(field, e.target.value)}
              onBlur={(e) => handleOtherInputBlur(field, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default SolicitacaoDeExameAninhar;