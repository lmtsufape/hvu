package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.LaudoNecropsiaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.LaudoNecropsia;

@Service
public class LaudoNecropsiaService implements LaudoNecropsiaServiceInterface {
	@Autowired
	private LaudoNecropsiaRepository repository;


	public LaudoNecropsia saveLaudoNecropsia(LaudoNecropsia newInstance) {
		return repository.save(newInstance);
	}

	public LaudoNecropsia updateLaudoNecropsia(LaudoNecropsia transientObject) {
		return repository.save(transientObject);
	}

	public LaudoNecropsia findLaudoNecropsiaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "LaudoNecropsia"));
	}

	public List<LaudoNecropsia> getAllLaudoNecropsia(){
		return repository.findAll();
	}

	public void deleteLaudoNecropsia(LaudoNecropsia persistentObject){
		this.deleteLaudoNecropsia(persistentObject.getId());
		
	}
	
	public void deleteLaudoNecropsia(long id){
		LaudoNecropsia obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "LaudoNecropsia"));
		repository.delete(obj);
	}	
	
	
	
}