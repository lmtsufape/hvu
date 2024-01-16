package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.TipoMucosaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.TipoMucosa;

@Service
public class TipoMucosaService implements TipoMucosaServiceInterface {
	@Autowired
	private TipoMucosaRepository repository;


	public TipoMucosa saveTipoMucosa(TipoMucosa newInstance) {
		return repository.save(newInstance);
	}

	public TipoMucosa updateTipoMucosa(TipoMucosa transientObject) {
		return repository.save(transientObject);
	}

	public TipoMucosa findTipoMucosaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "TipoMucosa"));
	}

	public List<TipoMucosa> getAllTipoMucosa(){
		return repository.findAll();
	}

	public void deleteTipoMucosa(TipoMucosa persistentObject){
		this.deleteTipoMucosa(persistentObject.getId());
		
	}
	
	public void deleteTipoMucosa(long id){
		TipoMucosa obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoMucosa with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}