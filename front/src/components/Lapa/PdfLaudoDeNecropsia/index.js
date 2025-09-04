"use client"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import styles from "./index.module.css"

pdfMake.vfs = pdfFonts.pdfMake.vfs

const pdfStyles = {
  header: {
    fontSize: 18,
    bold: true,
    alignment: "center",
    margin: [0, 0, 0, 20],
    color: "#000000",
  },
  subheader: {
    fontSize: 14,
    bold: true,
    alignment: "center",
    margin: [0, 0, 0, 10],
    color: "#272727",
  },
  dateTime: {
    fontSize: 12,
    alignment: "center",
    margin: [0, 0, 0, 30],
    color: "#404040",
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    margin: [0, 20, 0, 10],
    color: "#000000",
  },
  label: {
    fontSize: 11,
    bold: true,
    color: "#404040",
    margin: [0, 8, 0, 2],
  },
  value: {
    fontSize: 11,
    color: "#39805F",
    margin: [0, 0, 0, 8],
  },
  footer: {
    fontSize: 10,
    alignment: "center",
    margin: [0, 30, 0, 0],
    color: "#404040",
  },
}

const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return (
    date.toLocaleDateString("pt-BR") +
    " - " +
    date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  )
}

const generateLaudoContent = (laudo) => {
  const content = []

  // Cabeçalho
  content.push(
    { text: "LAUDO DE NECROPSIA", style: "header" },
    { text: "Serviços Veterinários Especializados", style: "subheader" },
    { text: formatDate(new Date()), style: "dateTime" },
  )

  // Código da Patologia
  if (laudo.fichaSolicitacaoServico?.codigoPatologia) {
    content.push(
      { text: "IDENTIFICAÇÃO", style: "sectionTitle" },
      { text: "Código da Patologia:", style: "label" },
      { text: laudo.fichaSolicitacaoServico.codigoPatologia, style: "value" },
    )
  }

  // Conclusão
  content.push(
    { text: "CONCLUSÃO", style: "sectionTitle" },
    { text: "Diagnóstico Final:", style: "label" },
    { text: laudo.conclusao || "Não definido", style: "value" },
  )

  // Macroscopia
  content.push({ text: "MACROSCOPIA", style: "sectionTitle" })

  if (laudo.campoLaudo && laudo.campoLaudo.length > 0) {
    laudo.campoLaudo.forEach((campo, index) => {
      content.push(
        { text: `Exame ${index + 1}:`, style: "label" },
        { text: `Órgão: ${campo.orgao?.nome || "Não especificado"}`, style: "value" },
        { text: `Descrição: ${campo.descricao}`, style: "value" },
      )
    })
  } else {
    content.push({ text: "Não definido", style: "value" })
  }

  // Microscopia
  content.push({ text: "MICROSCOPIA", style: "sectionTitle" })

  if (laudo.campoMicroscopia && laudo.campoMicroscopia.length > 0) {
    laudo.campoMicroscopia.forEach((campo, index) => {
      content.push(
        { text: `Exame ${index + 1}:`, style: "label" },
        { text: `Órgão: ${campo.orgao?.nome || "Não especificado"}`, style: "value" },
        { text: `Processamento: ${campo.processamento}`, style: "value" },
        { text: `Descrição: ${campo.descricao}`, style: "value" },
      )
    })
  } else {
    content.push({ text: "Não definido", style: "value" })
  }

  // Estagiários
  content.push({ text: "ESTAGIÁRIO(A) RESPONSÁVEL", style: "sectionTitle" })

  if (laudo.estagiario && laudo.estagiario.length > 0) {
    laudo.estagiario.forEach((est) => {
      content.push(
        { text: `Nome: ${est.nome}`, style: "value" },
        { text: `CPF: ${est.cpf}     Período: ${est.periodo}`, style: "value" },
      )
    })
  } else {
    content.push({ text: "Nenhum estagiário selecionado", style: "value" })
  }

  // Fotos
  if (laudo.foto && laudo.foto.length > 0) {
    content.push(
      { text: "DOCUMENTAÇÃO FOTOGRÁFICA", style: "sectionTitle" },
      { text: `Total de ${laudo.foto.length} foto(s) anexada(s) ao laudo`, style: "value" },
    )
  }

  return content
}

// Componente do botão
const GenerateLaudoPdfButton = ({ laudo }) => {
  const generatePdf = () => {
    if (!laudo || !laudo.id) {
      alert("Dados do laudo não disponíveis para gerar PDF")
      return
    }

    const docDefinition = {
      content: generateLaudoContent(laudo),
      styles: pdfStyles,
      pageMargins: [60, 60, 60, 80],
      footer: (currentPage, pageCount) => ({
        text: `Laudo de Necropsia - ${laudo.fichaSolicitacaoServico?.codigoPatologia || "N/A"}                                                                                                                    Página ${currentPage} de ${pageCount}`,
        style: "footer",
      }),
    }

    const fileName = `Laudo_Necropsia_${laudo.fichaSolicitacaoServico?.codigoPatologia || laudo.id}_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.pdf`

    pdfMake.createPdf(docDefinition).download(fileName)
  }

  return (
    <button onClick={generatePdf} className={styles["btn-pdf"]} type="button">
      Gerar PDF
    </button>
  )
}

export default GenerateLaudoPdfButton
