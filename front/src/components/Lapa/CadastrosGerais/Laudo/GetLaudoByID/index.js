"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from "./index.module.css"
import VoltarButton from "../../../VoltarButton"
import { getLaudoNecropsiaById } from "../../../../../../services/laudoNecropsiaService"
import { EditarWhiteButton } from "@/components/WhiteButton"
import { getToken, getRoles } from "../../../../../../services/userService"
import GenerateLaudoPdfButton from "../../../PdfLaudoDeNecropsia"

function GetLaudoNecropsiaById() {
  const router = useRouter()
  const { id } = router.query
  const [laudo, setLaudo] = useState({})
  const roles = getRoles()
  const token = getToken()

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    if (!roles.includes("patologista")) {
      router.push("/access-denied")
      return
    }

    if (id) {
      const fetchData = async () => {
        try {
          const laudoData = await getLaudoNecropsiaById(id)
          console.log(laudoData)
          setLaudo(laudoData || {})
        } catch (error) {
          console.error("Erro ao buscar laudo:", error)
        }
      }
      fetchData()
    }
  }, [id, router])

  if (!token || !roles.includes("patologista")) {
    return null
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Informações do Laudo</h1>

      <div className={styles.container_box}>
        <ul>
          {laudo && (
            <div className={styles.list_container}>
              <li key={laudo.id} className={styles.list_box}>
                <div className={styles.title_endereco}></div>
                <div className={styles.tutor}>
                  <div className={styles.item_box}>
                    <h6>Código da Patologia</h6>
                    <h4 className={styles.medico_nome}>{laudo.fichaSolicitacaoServico?.codigoPatologia}</h4>
                  </div>

                  <div className={styles.item_box}>
                    <h6>Conclusão</h6>
                    <div>{laudo.conclusao ? laudo.conclusao : "Não definido"}</div>
                  </div>

                  <div className={styles.item_box}>
                    <h6>Macroscopia</h6>
                    {laudo.campoLaudo && laudo.campoLaudo.length > 0 ? (
                      <div className={styles.campos_container}>
                        {laudo.campoLaudo.map((campo, index) => (
                          <div key={campo.id} className={styles.campo_card}>
                            <div className={styles.campo_header}>
                              <span className={styles.campo_numero}>Campo {index + 1}</span>
                              {campo.orgao?.nome && <span className={styles.orgao_tag}>{campo.orgao.nome}</span>}
                            </div>
                            <div className={styles.campo_content}>
                              <div className={styles.campo_text}>
                                <div className={styles.campo_item}>
                                  <strong>Descrição:</strong>
                                  <p>{campo.descricao}</p>
                                </div>
                              </div>
                              {campo.orgao?.foto && (
                                <div className={styles.campo_image}>
                                  <img
                                    src={`/uploads/${campo.orgao.foto.foto_path}`}
                                    alt={campo.orgao.foto.titulo}
                                    className={styles.orgao_foto}
                                  />
                                  <span className={styles.image_caption}>{campo.orgao.foto.titulo}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>Não definido</div>
                    )}
                  </div>

                  <div className={styles.item_box}>
                    <h6>Microscopia</h6>
                    {laudo.campoMicroscopia && laudo.campoMicroscopia.length > 0 ? (
                      <div className={styles.campos_container}>
                        {laudo.campoMicroscopia.map((campo, index) => (
                          <div key={campo.id} className={styles.campo_card}>
                            <div className={styles.campo_header}>
                              <span className={styles.campo_numero}>Campo {index + 1}</span>
                              {campo.orgao?.nome && <span className={styles.orgao_tag}>{campo.orgao.nome}</span>}
                            </div>
                            <div className={styles.campo_content}>
                              <div className={styles.campo_text}>
                                <div className={styles.campo_item}>
                                  <strong>Descrição:</strong>
                                  <p>{campo.descricao}</p>
                                </div>
                                <div className={styles.campo_item}>
                                  <strong>Processamento:</strong>
                                  <p>{campo.processamento}</p>
                                </div>
                              </div>
                              {campo.orgao?.foto && (
                                <div className={styles.campo_image}>
                                  <img
                                    src={`/uploads/${campo.orgao.foto.foto_path}`}
                                    alt={campo.orgao.foto.titulo}
                                    className={styles.orgao_foto}
                                  />
                                  <span className={styles.image_caption}>{campo.orgao.foto.titulo}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>Não definido</div>
                    )}
                  </div>

                  <div className={styles.item_box}>
                    <h6>Estagiário(a)</h6>
                    {laudo.estagiario && laudo.estagiario.length > 0 ? (
                      laudo.estagiario.map((est) => (
                        <div key={est.id}>
                          {est.nome} - CPF: {est.cpf} - Período: {est.periodo}
                        </div>
                      ))
                    ) : (
                      <p>Nenhum estagiário selecionado</p>
                    )}
                  </div>

                  <div className={styles.item_box}>
                    <h6>Fotos</h6>
                    {laudo.foto && laudo.foto.length > 0 ? (
                      laudo.foto.map((f) => (
                        <div key={f.id}>
                          <strong>{f.titulo}</strong> <br />
                          <img src={`/uploads/${f.foto_path}`} alt={f.titulo} width={100} />
                        </div>
                      ))
                    ) : (
                      <p>Não disponível</p>
                    )}
                  </div>
                </div>
              </li>
            </div>
          )}
        </ul>
        <div className={styles.button_container}>
          <EditarWhiteButton page={"/lapa/updateLaudo"} id={laudo.id} />
          <GenerateLaudoPdfButton laudo={laudo} />
        </div>
      </div>
    </div>
  )
}

export default GetLaudoNecropsiaById
