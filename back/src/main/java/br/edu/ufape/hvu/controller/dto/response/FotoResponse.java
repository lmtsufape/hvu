package br.edu.ufape.hvu.controller.dto.response;

import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Foto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class FotoResponse {
    private Long id;
    private String titulo;
    private String nomeArquivo;
    private String tipoArquivo;
    private LocalDateTime dataUpload;

    public FotoResponse(Foto foto) {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        modelMapper.map(foto, this);
    }
}
