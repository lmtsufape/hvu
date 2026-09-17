package br.edu.ufape.hvu.controller.dto.response;

import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Ficha;
import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.service.VagaServiceInterface;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

@Getter @Setter @NoArgsConstructor
public  class FichaResponse  {
    private long id;
    private String nome;
    private String conteudo;
    @DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
    private LocalDateTime dataHora;
    private AgendamentoResponse agendamento;
    private MedicoResponse medico;
    private MedicoResponse medicoResponsavel;
    private AnimalResponse animal;

    public FichaResponse(Ficha obj) {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        modelMapper.map(obj, this);

        VagaServiceInterface vagaService =
                (VagaServiceInterface) SpringApplicationContext.getBean("vagaService");
        if (obj.getAgendamento() != null) {
            Vaga vaga = vagaService.findVagaByAgendamento(obj.getAgendamento());
            if (vaga != null && vaga.getMedico() != null) {
                this.medicoResponsavel = new MedicoResponse(vaga.getMedico());
            }
        }
    }

}
