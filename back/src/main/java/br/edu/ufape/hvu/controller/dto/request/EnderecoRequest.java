package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Endereco;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class EnderecoRequest {
    private long id;
	private String cep;
	private String rua;
	private String estado;
	private String cidade;
	private int numero;
	private String bairro;

	public Endereco convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Endereco.class);
	}
}
