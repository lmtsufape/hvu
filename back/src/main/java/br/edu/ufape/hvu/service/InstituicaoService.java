package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.InstituicaoRepository;
import br.edu.ufape.hvu.model.Instituicao;

@Service
public class InstituicaoService implements InstituicaoServiceInterface {
	@Autowired
	private InstituicaoRepository repository;


	public Instituicao saveInstituicao(Instituicao newInstance) {
		return repository.save(newInstance);
	}

	public Instituicao updateInstituicao(Instituicao transientObject) {
		return repository.save(transientObject);
	}

	public Instituicao findInstituicaoById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Instituicao with id = " + id));
	}

	public List<Instituicao> getAllInstituicao(){
		return repository.findAll();
	}

	public void deleteInstituicao(Instituicao persistentObject){
		this.deleteInstituicao(persistentObject.getId());
		
	}
	
	public void deleteInstituicao(long id){
		Instituicao obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Instituicao with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}