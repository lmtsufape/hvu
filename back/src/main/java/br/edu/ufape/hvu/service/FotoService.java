package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.FotoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Foto;

@Service
public class FotoService implements FotoServiceInterface {
	@Autowired
	private FotoRepository repository;


	public Foto saveFoto(Foto newInstance) {
		return repository.save(newInstance);
	}

	public Foto updateFoto(Foto transientObject) {
		return repository.save(transientObject);
	}

	public Foto findFotoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Foto"));
	}

	public List<Foto> getAllFoto(){
		return repository.findAll();
	}

	public void deleteFoto(Foto persistentObject){
		this.deleteFoto(persistentObject.getId());
		
	}
	
	public void deleteFoto(long id){
		Foto obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Foto"));
		repository.delete(obj);
	}	
	
	
	
}