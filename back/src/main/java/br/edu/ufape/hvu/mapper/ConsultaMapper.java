package br.edu.ufape.hvu.mapper;

import org.springframework.stereotype.Component;
import br.edu.ufape.hvu.controller.dto.request.ConsultaRequestFix;
import br.edu.ufape.hvu.model.Consulta;
import br.edu.ufape.hvu.controller.dto.response.AnimalResponseFix;
import br.edu.ufape.hvu.controller.dto.response.EspecialidadeResponse;
import br.edu.ufape.hvu.controller.dto.response.ConsultaResponseFix;
import br.edu.ufape.hvu.controller.dto.response.MedicoResponse;

@Component
public class ConsultaMapper {

    public Consulta toEntity(ConsultaRequestFix request) {
        Consulta consulta = new Consulta();

        consulta.setId(request.getId());
        consulta.setPesoAtual(request.getPesoAtual());
        consulta.setIdadeAtual(request.getIdadeAtual());
        consulta.setProximaConsulta(request.isProximaConsulta());
        consulta.setDataVaga(request.getDataVaga());
        consulta.setQueixaPrincipal(request.getQueixaPrincipal());
        consulta.setAlteracoesClinicasDiversas(
                request.getAlteracoesClinicasDiversas()
        );
        consulta.setSuspeitasClinicas(
                request.getSuspeitasClinicas()
        );
        consulta.setAlimentacao(request.getAlimentacao());

        return consulta;
    }

    public ConsultaResponseFix toResponse(Consulta consulta) {

        AnimalResponseFix animalResponse = null;

        if (consulta.getAnimal() != null) {
            animalResponse = AnimalResponseFix.builder()
                    .id(consulta.getAnimal().getId())
                    .nome(consulta.getAnimal().getNome())
                    .sexo(consulta.getAnimal().getSexo())
                    .alergias(consulta.getAnimal().getAlergias())
                    .dataNascimento(consulta.getAnimal().getDataNascimento())
                    .imagem(consulta.getAnimal().getImagem())
                    .castrado(consulta.getAnimal().isCastrado())
                    .peso(consulta.getAnimal().getPeso())
                    .origemAnimal(consulta.getAnimal().getOrigemAnimal())
                    .obito(consulta.getAnimal().isObito())
                    .codigoProntuario(consulta.getAnimal().getCodigoProntuario())
                    .tipo(consulta.getAnimal().getTipo())
                    .build();
        }

        MedicoResponse medicoResponse = null;

        if (consulta.getMedico() != null) {
            medicoResponse = new MedicoResponse(
                    consulta.getMedico()
            );
        }

        EspecialidadeResponse especialidadeResponse = null;

        if (consulta.getEncaminhamento() != null) {
            especialidadeResponse = new EspecialidadeResponse(
                    consulta.getEncaminhamento()
            );
        }

        return ConsultaResponseFix.builder()
                .id(consulta.getId())
                .pesoAtual(consulta.getPesoAtual())
                .idadeAtual(consulta.getIdadeAtual())
                .medico(medicoResponse)
                .proximaConsulta(consulta.isProximaConsulta())
                .animal(animalResponse)
                .dataVaga(consulta.getDataVaga())
                .queixaPrincipal(consulta.getQueixaPrincipal())
                .alteracoesClinicasDiversas(
                        consulta.getAlteracoesClinicasDiversas()
                )
                .suspeitasClinicas(
                        consulta.getSuspeitasClinicas()
                )
                .alimentacao(consulta.getAlimentacao())
                .encaminhamento(especialidadeResponse)
                .build();
    }
}
