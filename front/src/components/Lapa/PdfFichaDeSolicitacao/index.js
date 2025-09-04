"use client"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import styles from "./index.module.css"

pdfMake.vfs = pdfFonts.pdfMake.vfs

const GeneratePdfButton = ({ ficha }) => {
  const generatePdf = () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      return `${formattedDate} - ${hours}:${minutes}`
    }

    const docDefinition = {
      content: [
        { text: "FICHA PARA SOLICITAÇÃO DE SERVIÇOS", style: "mainHeader" },
        { text: "Serviços Veterinários Especializados", style: "subtitle" },
        {
          text: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          style: "dateHeader",
        },

        {
          text: [
            { text: "Ficha Patologia: ", style: "label" },
            { text: ficha.codigoPatologia || "N/A", style: "value" },
            { text: "     Ficha Clínica: ", style: "label" },
            { text: ficha.fichaClinica || "N/A", style: "value" },
          ],
          margin: [0, 10, 0, 5],
        },
        {
          text: [
            { text: "Data Recebimento: ", style: "label" },
            { text: formatDate(ficha.dataRecebimento) || "N/A", style: "value" },
            { text: "     Tipo de Serviço: ", style: "label" },
            { text: ficha.tipoServico || "Necropsia", style: "value" },
          ],
          margin: [0, 0, 0, 15],
        },

        { text: "IDENTIFICAÇÃO DO TUTOR", style: "sectionHeader" },
        {
          text: [
            { text: "Nome: ", style: "label" },
            { text: ficha.tutor?.nome || "N/A", style: "value" },
            { text: "     Telefone: ", style: "label" },
            { text: ficha.tutor?.telefone || "N/A", style: "value" },
          ],
          margin: [0, 5, 0, 3],
        },
        {
          text: [
            { text: "E-mail: ", style: "label" },
            { text: ficha.tutor?.email || "N/A", style: "value" },
            { text: "     Endereço: ", style: "label" },
            { text: ficha.tutor?.endereco?.rua || "N/A", style: "value" },
          ],
          margin: [0, 0, 0, 15],
        },

        { text: "IDENTIFICAÇÃO DO ANIMAL", style: "sectionHeader" },
        {
          text: [
            { text: "Nome: ", style: "label" },
            { text: ficha.animal?.nome || "N/A", style: "value" },
            { text: "     Espécie: ", style: "label" },
            { text: ficha.animal?.raca?.especie?.nome || "N/A", style: "value" },
            { text: "     Raça: ", style: "label" },
            { text: ficha.animal?.raca?.nome || "N/A", style: "value" },
          ],
          margin: [0, 5, 0, 3],
        },
        {
          text: [
            { text: "Sexo: ", style: "label" },
            { text: ficha.animal?.sexo || "N/A", style: "value" },
            { text: "     Peso (Kg): ", style: "label" },
            { text: ficha.animal?.peso || "N/A", style: "value" },
            { text: "     Idade: ", style: "label" },
            {
              text: ficha.animal?.dataNascimento
                ? `${new Date().getFullYear() - new Date(ficha.animal.dataNascimento).getFullYear()} anos`
                : "N/A",
              style: "value",
            },
          ],
          margin: [0, 0, 0, 15],
        },

        { text: "MÉDICO VETERINÁRIO REQUISITANTE", style: "sectionHeader" },
        {
          text: [
            { text: "Nome: ", style: "label" },
            { text: ficha.medico?.nome || "N/A", style: "value" },
            { text: "     CRMV: ", style: "label" },
            { text: ficha.medico?.crmv || "N/A", style: "value" },
            { text: "     Telefone: ", style: "label" },
            { text: ficha.medico?.telefone || "N/A", style: "value" },
          ],
          margin: [0, 5, 0, 3],
        },
        {
          text: [
            { text: "E-mail: ", style: "label" },
            { text: ficha.medico?.email || "N/A", style: "value" },
          ],
          margin: [0, 0, 0, 15],
        },

        { text: "INFORMAÇÕES SOBRE MATERIAL", style: "sectionHeader" },
        {
          text: [
            { text: "Data/Hora Óbito: ", style: "label" },
            { text: formatDate(ficha.dataHoraObito) || "N/A", style: "value" },
            { text: "     Conservação: ", style: "label" },
            { text: ficha.estadoConservacao || "N/A", style: "value" },
            { text: "     Eutanásia: ", style: "label" },
            { text: ficha.eutanasia ? "Sim" : "Não", style: "value" },
          ],
          margin: [0, 5, 0, 3],
        },
        {
          text: [
            { text: "Acondicionamento: ", style: "label" },
            { text: ficha.acondicionamento || "N/A", style: "value" },
          ],
          margin: [0, 0, 0, 15],
        },

        { text: "HISTÓRICO CLÍNICO", style: "sectionHeader" },
        {
          text: ficha.historico || "N/A",
          style: "historyText",
          margin: [0, 5, 0, 30],
        },

        {
          text: `Ficha de Solicitação de Serviços - ${ficha.codigoPatologia || "N/A"}`,
          style: "footer",
          absolutePosition: { x: 40, y: 750 },
        },
        {
          text: "Página 1 de 1",
          style: "footer",
          absolutePosition: { x: 500, y: 750 },
        },
      ],
      styles: {
        mainHeader: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 5],
        },
        subtitle: {
          fontSize: 14,
          alignment: "center",
          margin: [0, 0, 0, 5],
        },
        dateHeader: {
          fontSize: 12,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5],
          decoration: "underline",
        },
        label: {
          fontSize: 10,
          bold: true,
        },
        value: {
          fontSize: 10,
        },
        historyText: {
          fontSize: 10,
          alignment: "justify",
        },
        footer: {
          fontSize: 8,
          italics: true,
        },
      },
      pageMargins: [40, 60, 40, 80],
    }

    pdfMake.createPdf(docDefinition).download(`FichaSolicitacao-${ficha.codigoPatologia}.pdf`)
  }

  return (
    <button onClick={generatePdf} className={styles["btn-pdf"]} type="button">
      Gerar PDF
    </button>
  )
}

export default GeneratePdfButton
