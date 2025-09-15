package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.EnderecoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Endereco;

@Service
@RequiredArgsConstructor
public class EnderecoService implements EnderecoServiceInterface {
	private final EnderecoRepository repository;


	public Endereco saveEndereco(Endereco newInstance) {
		return repository.save(newInstance);
	}

	public Endereco updateEndereco(Endereco transientObject) {
		return repository.save(transientObject);
	}

	public Endereco findEnderecoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Endereco"));
	}

	public List<Endereco> getAllEndereco(){
		return repository.findAll();
	}

	public void deleteEndereco(long id){
		Endereco obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Endereco"));
		repository.delete(obj);
	}	
	
	
	
}