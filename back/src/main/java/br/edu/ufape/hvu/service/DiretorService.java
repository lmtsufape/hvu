package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.DiretorRepository;
import br.edu.ufape.hvu.model.Diretor;

@Service
public class DiretorService implements DiretorServiceInterface {
	@Autowired
	private DiretorRepository repository;


	public Diretor saveDiretor(Diretor newInstance) {
		return repository.save(newInstance);
	}

	public Diretor updateDiretor(Diretor transientObject) {
		return repository.save(transientObject);
	}

	public Diretor findDiretorById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Diretor with id = " + id));
	}

	public List<Diretor> getAllDiretor(){
		return repository.findAll();
	}

	public void deleteDiretor(Diretor persistentObject){
		this.deleteDiretor(persistentObject.getId());
		
	}
	
	public void deleteDiretor(long id){
		Diretor obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Diretor with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}