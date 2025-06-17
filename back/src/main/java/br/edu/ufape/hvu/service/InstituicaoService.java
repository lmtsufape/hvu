package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.InstituicaoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Instituicao;

@Service
@RequiredArgsConstructor
public class InstituicaoService implements InstituicaoServiceInterface {
	private final InstituicaoRepository repository;


	public Instituicao saveInstituicao(Instituicao newInstance) {
		return repository.save(newInstance);
	}

	public Instituicao updateInstituicao(Instituicao transientObject) {
		return repository.save(transientObject);
	}

	public Instituicao findInstituicaoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Instituição"));
	}

	public List<Instituicao> getAllInstituicao(){
		return repository.findAll();
	}

	public void deleteInstituicao(long id){
		Instituicao obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Instituição"));
		repository.delete(obj);
	}	
	
	
	
}