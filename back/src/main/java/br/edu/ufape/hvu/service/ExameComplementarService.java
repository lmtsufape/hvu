package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.ExameComplementarRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.ExameComplementar;

@Service
public class ExameComplementarService implements ExameComplementarServiceInterface {
	@Autowired
	private ExameComplementarRepository repository;


	public ExameComplementar saveExameComplementar(ExameComplementar newInstance) {
		return repository.save(newInstance);
	}

	public ExameComplementar updateExameComplementar(ExameComplementar transientObject) {
		return repository.save(transientObject);
	}

	public ExameComplementar findExameComplementarById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "ExameComplementar"));
	}

	public List<ExameComplementar> getAllExameComplementar(){
		return repository.findAll();
	}

	public void deleteExameComplementar(ExameComplementar persistentObject){
		this.deleteExameComplementar(persistentObject.getId());
		
	}
	
	public void deleteExameComplementar(long id){
		ExameComplementar obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "ExameComplementar"));
		repository.delete(obj);
	}	
	
	
	
}