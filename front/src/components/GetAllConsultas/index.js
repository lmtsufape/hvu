import React from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import HistoricoFichasAnimal from "../HistoricoFichasAnimal";

function GetAllConsultas() {
  const router = useRouter();
  const { id: animalId } = router.query;

  return (
    <div className={styles.pageContainer}>
      <VoltarButton />
      <HistoricoFichasAnimal
        animalId={animalId}
        allowedRoles={["medico", "patologista"]}
      />
    </div>
  );
}

export default GetAllConsultas;
