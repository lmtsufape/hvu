import api from "../common/http-common-back";

// Upload de uma nova foto
export async function uploadFoto(file, titulo) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("titulo", titulo);

    const response = await api.post("/fotos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Substituir/atualizar uma foto
export async function replaceFoto(id, file, titulo) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("titulo", titulo);

    const response = await api.put(`/fotos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Buscar todas as fotos (metadados)
export async function getAllFotos() {
  try {
    const response = await api.get("/fotos");
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Buscar metadados de uma foto por ID
export async function getFotoInfo(id) {
  try {
    const response = await api.get(`/fotos/info/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Buscar o arquivo da foto por ID (retorna blob para exibir/download)
export async function getFotoById(id) {
  try {
    const response = await api.get(`/fotos/${id}`, {
      responseType: "blob", 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Excluir foto por ID
export async function deleteFoto(id) {
  try {
    const response = await api.delete(`/fotos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
