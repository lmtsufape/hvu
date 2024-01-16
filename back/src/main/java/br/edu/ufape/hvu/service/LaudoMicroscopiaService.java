package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.LaudoMicroscopiaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.LaudoMicroscopia;

@Service
public class LaudoMicroscopiaService implements LaudoMicroscopiaServiceInterface {
	@Autowired
	private LaudoMicroscopiaRepository repository;


	public LaudoMicroscopia saveLaudoMicroscopia(LaudoMicroscopia newInstance) {
		return repository.save(newInstance);
	}

	public LaudoMicroscopia updateLaudoMicroscopia(LaudoMicroscopia transientObject) {
		return repository.save(transientObject);
	}

	public LaudoMicroscopia findLaudoMicroscopiaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "LaudoMicroscopia"));
	}

	public List<LaudoMicroscopia> getAllLaudoMicroscopia(){
		return repository.findAll();
	}

	public void deleteLaudoMicroscopia(LaudoMicroscopia persistentObject){
		this.deleteLaudoMicroscopia(persistentObject.getId());
		
	}
	
	public void deleteLaudoMicroscopia(long id){
		LaudoMicroscopia obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "LaudoMicroscopia"));
		repository.delete(obj);
	}	
	
	
	
}