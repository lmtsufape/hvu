package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Patologista;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor
public  class PatologistaRequest extends UsuarioRequest {
    private long id;
    @NotNull( message = "Crmv não pode estar em branco")
    private String crmv;
    @NotNull
    private List<EspecialidadeRequest> especialidade;
    private InstituicaoRequest instituicao;


    public Patologista convertToEntity() {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Patologista.class);
    }
}
