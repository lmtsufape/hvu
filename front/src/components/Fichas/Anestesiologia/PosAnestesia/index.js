import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import { CancelarWhiteButton }         from "@/components/WhiteButton";
import { ContinuarFichasGreenButton }  from "@/components/GreenButton";

export default function PosAnestesia({
  formData,
  setFormData,
  handleChange,
  handleCheckboxChange,
  prevStep,
  handleSubmit
}) {

  /* coloque aqui os campos que desejar (analgesia, tempo de recuperação etc.) */

  return (
    <div className={styles.container}>
      <VoltarButton onClick={prevStep} />
      <h1 className="text-center mb-4">Ficha de Anestesiologia – Pós-Anestesia</h1>

      {/* TODO: formulário */}

      <div className={styles.button_box}>
        <CancelarWhiteButton />
        <FinalizarFichaModal onConfirm={handleSubmit} />
      </div>
    </div>
  );
}
