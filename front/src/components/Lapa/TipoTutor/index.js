"use client"
import styles from "./index.module.css"
import Image from "next/image"
import { useRouter } from "next/router"
import { getToken, getRoles } from "../../../../services/userService"

function TipoTutor() {
  const router = useRouter()
  const roles = getRoles()
  const token = getToken()

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    )
  }

  if (!roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.box_button}>
        <button className={styles.button} onClick={() => router.push("/lapa/createAnimal?tipo=novo")}>
          <Image src="/tutor.svg" alt="Tutores" width={62} height={62} />
          <h6>Novo Responsável</h6>
        </button>
        <button className={styles.button} onClick={() => router.push("/lapa/createAnimal?tipo=anonimo")}>
          <Image src="/tutor.svg" alt="Tutores" width={62} height={62} />
          <h6>Responsável anônimo</h6>
        </button>
        <button className={styles.button} onClick={() => router.push("/lapa/createAnimal?tipo=existente")}>
          <Image src="/tutor.svg" alt="Tutores" width={62} height={62} />
          <h6>Responsável existente</h6>
        </button>
      </div>
    </div>
  )
}

export default TipoTutor
