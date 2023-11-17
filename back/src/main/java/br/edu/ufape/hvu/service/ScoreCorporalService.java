package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.ScoreCorporalRepository;
import br.edu.ufape.hvu.model.ScoreCorporal;

@Service
public class ScoreCorporalService implements ScoreCorporalServiceInterface {
	@Autowired
	private ScoreCorporalRepository repository;


	public ScoreCorporal saveScoreCorporal(ScoreCorporal newInstance) {
		return repository.save(newInstance);
	}

	public ScoreCorporal updateScoreCorporal(ScoreCorporal transientObject) {
		return repository.save(transientObject);
	}

	public ScoreCorporal findScoreCorporalById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist ScoreCorporal with id = " + id));
	}

	public List<ScoreCorporal> getAllScoreCorporal(){
		return repository.findAll();
	}

	public void deleteScoreCorporal(ScoreCorporal persistentObject){
		this.deleteScoreCorporal(persistentObject.getId());
		
	}
	
	public void deleteScoreCorporal(long id){
		ScoreCorporal obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist ScoreCorporal with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}