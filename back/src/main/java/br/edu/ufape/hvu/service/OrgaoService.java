package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.OrgaoRepository;
import br.edu.ufape.hvu.model.Orgao;

@Service
public class OrgaoService implements OrgaoServiceInterface {
	@Autowired
	private OrgaoRepository repository;


	public Orgao saveOrgao(Orgao newInstance) {
		return repository.save(newInstance);
	}

	public Orgao updateOrgao(Orgao transientObject) {
		return repository.save(transientObject);
	}

	public Orgao findOrgaoById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Orgao with id = " + id));
	}

	public List<Orgao> getAllOrgao(){
		return repository.findAll();
	}

	public void deleteOrgao(Orgao persistentObject){
		this.deleteOrgao(persistentObject.getId());
		
	}
	
	public void deleteOrgao(long id){
		Orgao obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Orgao with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}