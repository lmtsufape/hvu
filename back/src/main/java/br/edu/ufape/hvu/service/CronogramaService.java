package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.CronogramaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Cronograma;

@Service
public class CronogramaService implements CronogramaServiceInterface {
	@Autowired
	private CronogramaRepository repository;


	public Cronograma saveCronograma(Cronograma newInstance) {
		return repository.save(newInstance);
	}

	public Cronograma updateCronograma(Cronograma transientObject) {
		return repository.save(transientObject);
	}

	public Cronograma findCronogramaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Cronograma"));
	}

	public List<Cronograma> getAllCronograma(){
		return repository.findAll();
	}

	public void deleteCronograma(Cronograma persistentObject){
		this.deleteCronograma(persistentObject.getId());
		
	}
	
	public void deleteCronograma(long id){
		Cronograma obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Cronograma"));
		repository.delete(obj);
	}	
	
	
	
}