package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.RotinaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Rotina;

@Service
public class RotinaService implements RotinaServiceInterface {
	@Autowired
	private RotinaRepository repository;


	public Rotina saveRotina(Rotina newInstance) {
		return repository.save(newInstance);
	}

	public Rotina updateRotina(Rotina transientObject) {
		return repository.save(transientObject);
	}

	public Rotina findRotinaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Rotina"));
	}

	public List<Rotina> getAllRotina(){
		return repository.findAll();
	}

	public void deleteRotina(Rotina persistentObject){
		this.deleteRotina(persistentObject.getId());
		
	}
	
	public void deleteRotina(long id){
		Rotina obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Rotina"));
		repository.delete(obj);
	}	
	
	
	
}