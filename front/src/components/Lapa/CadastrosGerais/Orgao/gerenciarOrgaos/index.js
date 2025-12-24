import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import SearchBar from "../../../../SearchBar";
import {
  getAllOrgao,
  deleteOrgao,
} from "../../../../../../services/orgaoService";
import { getFotoById } from "../../../../../../services/fotoService";
import VoltarButton from "../../../VoltarButton";
import ExcluirButton from "../../../../ExcluirButton";
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function GerenciarOrgaos() {
  const [orgaos, setOrgaos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deletedOrgaoId, setDeletedOrgaoId] = useState(null);
  const router = useRouter();
  const roles = getRoles();
  const token = getToken();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgaosData = await getAllOrgao();

        const orgaosComFoto = await Promise.all(
          orgaosData.map(async (orgao) => {
            try {
              // Se o órgão tem uma foto associada, busca o arquivo
              if (orgao.foto && orgao.foto.id) {
                const blob = await getFotoById(orgao.foto.id);
                const imageUrl = URL.createObjectURL(blob);
                return { ...orgao, imageUrl };
              }
              return { ...orgao, imageUrl: "/placeholder.svg" };
            } catch (error) {
              console.error(
                `Erro ao carregar arquivo da foto do órgão ${orgao.id}:`,
                error
              );
              return { ...orgao, imageUrl: "/placeholder.svg" };
            }
          })
        );

        setOrgaos(orgaosComFoto);
      } catch (error) {
        console.error("Erro ao buscar órgãos:", error);
      }
    };
    fetchData();
  }, [deletedOrgaoId]);

  const handleDeleteOrgao = async (orgaoId) => {
    try {
      await deleteOrgao(orgaoId);
      setOrgaos(orgaos.filter((orgao) => orgao.id !== orgaoId));
      setDeletedOrgaoId(orgaoId);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao excluir órgão:", error);
      if (error.response && error.response.status === 409) {
        setShowErrorAlert(true);
      }
    }
  };

  const filteredOrgaos = orgaos.filter((orgao) => {
    return orgao.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Listagem de Órgãos</h1>

      <div className={styles.navbar_container}>
        <SearchBar
          placeholder="Buscar por nome"
          onSearchChange={setSearchTerm}
        />
        <button
          className={styles.adicionar_raca_button}
          onClick={() => router.push("/lapa/createOrgao")}
        >
          Adicionar Órgão
        </button>
      </div>

      {filteredOrgaos.length === 0 ? (
        <p className={styles.paragrafo}> Órgão não encontrado.</p>
      ) : (
        <ul className={styles.list}>
          {filteredOrgaos.map((orgao) => (
            <li key={orgao.id} className={styles.info_container}>
              <div className={styles.info_box}>
                <h6>Título</h6>

                <div className={styles.nome_foto}>
                  <p>{orgao.nome}</p>

                  <div className={styles.foto_container}>
                    <img
                      src={orgao.imageUrl || "/placeholder.svg"}
                      alt={orgao.nome}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.button_container}>
                <button
                  className={styles.editar_button}
                  onClick={() => router.push(`/lapa/updateOrgao/${orgao.id}`)}
                >
                  Editar
                </button>
                <ExcluirButton itemId={orgao.id} onDelete={handleDeleteOrgao} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {showAlert && (
        <ErrorAlert message="Órgão excluído com sucesso!" show={showAlert} />
      )}
      {showErrorAlert && (
        <ErrorAlert
          message="Este órgão não pode ser excluído."
          show={showErrorAlert}
        />
      )}
    </div>
  );
}

export default GerenciarOrgaos;
