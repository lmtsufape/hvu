package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.TipoLinfonodosRepository;
import br.edu.ufape.hvu.model.TipoLinfonodos;

@Service
public class TipoLinfonodosService implements TipoLinfonodosServiceInterface {
	@Autowired
	private TipoLinfonodosRepository repository;


	public TipoLinfonodos saveTipoLinfonodos(TipoLinfonodos newInstance) {
		return repository.save(newInstance);
	}

	public TipoLinfonodos updateTipoLinfonodos(TipoLinfonodos transientObject) {
		return repository.save(transientObject);
	}

	public TipoLinfonodos findTipoLinfonodosById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoLinfonodos with id = " + id));
	}

	public List<TipoLinfonodos> getAllTipoLinfonodos(){
		return repository.findAll();
	}

	public void deleteTipoLinfonodos(TipoLinfonodos persistentObject){
		this.deleteTipoLinfonodos(persistentObject.getId());
		
	}
	
	public void deleteTipoLinfonodos(long id){
		TipoLinfonodos obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoLinfonodos with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}