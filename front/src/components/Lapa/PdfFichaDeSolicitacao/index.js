import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import styles from "./index.module.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const GeneratePdfButton = ({ ficha }) => {
    const generatePdf = () => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${formattedDate} - ${hours}:${minutes}`;
        };

        const docDefinition = {
            content: [
                { text: 'FICHA PARA SOLICITAÇÃO DE SERVIÇOS', style: 'header' },
                {
                    style: 'tableExample',
                    table: {
                        widths: [150, '*', 150, '*'],
                        body: [
                            [{ text: 'Ficha Patologia:', bold: true }, ficha.codigoPatologia || 'N/A', { text: 'Ficha Clínica:', bold: true }, ficha.fichaClinica || 'N/A'],
                            [{ text: 'Recebimento:', bold: true }, formatDate(ficha.dataRecebimento) || 'N/A', '', '']
                        ]
                    },
                    layout: 'noBorders'
                },
                { text: 'IDENTIFICAÇÃO DO TUTOR', style: 'subheader' },
                {
                    style: 'tableExample',
                    table: {
                        widths: [80, '*', 50, '*'],
                        body: [
                            [{ text: 'Nome:', bold: true }, ficha.tutor?.nome || 'N/A', { text: 'Endereço:', bold: true }, ficha.tutor?.endereco?.rua || 'N/A'],
                            [{ text: 'Telefone:', bold: true }, ficha.tutor?.telefone || 'N/A', { text: 'E-mail:', bold: true }, ficha.tutor?.email || 'N/A']
                        ]
                    },
                    layout: 'noBorders'
                },
                { text: 'IDENTIFICAÇÃO DO ANIMAL', style: 'subheader' },
                {
                    style: 'tableExample',
                    table: {
                        widths: [60, '*', 60, '*', 50, '*'],
                        body: [
                            [{ text: 'Nome:', bold: true }, ficha.animal?.nome || 'N/A', { text: 'Espécie:', bold: true }, ficha.animal?.raca?.especie?.nome || 'N/A', { text: 'Raça:', bold: true }, ficha.animal?.raca?.nome || 'N/A'],
                            [{ text: 'Sexo:', bold: true }, ficha.animal?.sexo || 'N/A', { text: 'Peso (Kg):', bold: true }, ficha.animal?.peso || 'N/A', { text: 'Idade:', bold: true }, ficha.animal?.dataNascimento ? `${new Date().getFullYear() - new Date(ficha.animal.dataNascimento).getFullYear()} anos` : 'N/A']
                        ]
                    },
                    layout: 'noBorders'
                },
                { text: 'MÉDICO VETERINÁRIO REQUISITANTE', style: 'subheader' },
                {
                    style: 'tableExample',
                    table: {
                        widths: [80, '*', 50, '*', 40, '*'],
                        body: [
                            [{ text: 'Nome:', bold: true }, ficha.medico?.nome || 'N/A', { text: 'CRMV:', bold: true }, ficha.medico?.crmv || 'N/A', { text: 'Telefone:', bold: true }, ficha.medico?.telefone || 'N/A'],
                            [{ text: 'E-mail:', bold: true }, ficha.medico?.email || 'N/A', '', '', '', '']
                        ]
                    },
                    layout: 'noBorders'
                },
                { text: 'INFORMAÇÃO SOBRE MATERIAL', style: 'subheader' },
                {
                    style: 'tableExample',
                    table: {
                        widths: [40, '*', 40, '*', 70, '*'],
                        body: [
                            [{ text: 'Óbito:', bold: true }, formatDate(ficha.dataHoraObito) || 'N/A', { text: 'Estado de Conservação:', bold: true }, ficha.estadoConservacao || 'N/A', { text: 'Eutanásia:', bold: true }, ficha.eutanasia ? 'Sim' : 'Não']
                        ]
                    },
                    layout: 'noBorders'
                },
                { text: 'HISTÓRICO', style: 'subheader' },
                { text: ficha.historico || 'N/A', margin: [0, 0, 0, 20] }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    marginBottom: 20,
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    marginTop: 10,
                    marginBottom: 5
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                }
            }
        };

        pdfMake.createPdf(docDefinition).download('FichaSolicitacao.pdf');
    };

    return (
        <button onClick={generatePdf} className={styles['btn-pdf']}>
            Gerar PDF
        </button>
    );
};

export default GeneratePdfButton;
