package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.TipoPosturaRepository;
import br.edu.ufape.hvu.model.TipoPostura;

@Service
public class TipoPosturaService implements TipoPosturaServiceInterface {
	@Autowired
	private TipoPosturaRepository repository;


	public TipoPostura saveTipoPostura(TipoPostura newInstance) {
		return repository.save(newInstance);
	}

	public TipoPostura updateTipoPostura(TipoPostura transientObject) {
		return repository.save(transientObject);
	}

	public TipoPostura findTipoPosturaById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoPostura with id = " + id));
	}

	public List<TipoPostura> getAllTipoPostura(){
		return repository.findAll();
	}

	public void deleteTipoPostura(TipoPostura persistentObject){
		this.deleteTipoPostura(persistentObject.getId());
		
	}
	
	public void deleteTipoPostura(long id){
		TipoPostura obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoPostura with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}