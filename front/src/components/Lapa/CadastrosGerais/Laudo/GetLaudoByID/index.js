import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { getLaudoNecropsiaById } from '../../../../../../services/laudoNecropsiaService';
import { EditarWhiteButton } from '@/components/WhiteButton';
import GeneratePdfButton from '../PdfLaudoNecropsia'; // Ajuste conforme necessário

function GetLaudoNecropsiaById() {
    const router = useRouter();
    const { id } = router.query;
    const [laudo, setLaudo] = useState({});

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const laudoData = await getLaudoNecropsiaById(id);
                    setLaudo(laudoData);
                } catch (error) {
                    console.error('Erro ao buscar laudo:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={styles.container}>
          <VoltarButton />
          <h1>LAUDO DE NECROPSIA / HISTOPATOLÓGICO</h1>
          <form className={styles.form_box} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <label htmlFor="ficha" className="form-label">Ficha</label>
                <input 
                  type="text"
                  className={`form-control ${errors.ficha ? "is-invalid" : ""}`}
                  name="ficha"
                  placeholder="Insira a ficha"
                  value={laudoData.ficha}
                />
              </div>
              <div className="col">
                <label htmlFor="fichaClinica" className="form-label">Ficha Clínica</label>
                <input
                  type="text"
                  className={`form-control ${errors.fichaClinica ? "is-invalid" : ""}`}
                  name="fichaClinica"
                  placeholder="Insira a ficha clínica"
                  value={laudoData.fichaClinica}
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
                {errors.recebimento && <div className="invalid-feedback">{errors.recebimento}</div>}
              </div>
            </div>
      
            <div className="row">
              <h2>Ficha Clínica</h2>
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
                    value="FMVZ"
                    checked={laudoData.material === 'FMVZ'}
                  /> FMVZ
                  <input 
                    type="checkbox"
                    name="material"
                    value="UNIVERSIDADE"
                    checked={laudoData.material === 'UNIVERSIDADE'}
                  /> UNIVERSIDADE
                </div>
              </div>
            </div>
      
            <div className="row">
              <h2>Observações</h2>
              <div className="col">
                <textarea 
                  className={`form-control ${errors.observacoes ? "is-invalid" : ""}`}
                  name="observacoes"
                  placeholder="Insira observações adicionais"
                  value={laudoData.observacoes}
                />
              </div>
            </div>
      
            <button type="submit" className="btn btn-primary">Salvar</button>
          </form>
        </div>
      );
      
}

export default GetLaudoNecropsiaById;
