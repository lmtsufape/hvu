package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.TipoTurgorCutaneoRepository;
import br.edu.ufape.hvu.model.TipoTurgorCutaneo;

@Service
public class TipoTurgorCutaneoService implements TipoTurgorCutaneoServiceInterface {
	@Autowired
	private TipoTurgorCutaneoRepository repository;


	public TipoTurgorCutaneo saveTipoTurgorCutaneo(TipoTurgorCutaneo newInstance) {
		return repository.save(newInstance);
	}

	public TipoTurgorCutaneo updateTipoTurgorCutaneo(TipoTurgorCutaneo transientObject) {
		return repository.save(transientObject);
	}

	public TipoTurgorCutaneo findTipoTurgorCutaneoById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoTurgorCutaneo with id = " + id));
	}

	public List<TipoTurgorCutaneo> getAllTipoTurgorCutaneo(){
		return repository.findAll();
	}

	public void deleteTipoTurgorCutaneo(TipoTurgorCutaneo persistentObject){
		this.deleteTipoTurgorCutaneo(persistentObject.getId());
		
	}
	
	public void deleteTipoTurgorCutaneo(long id){
		TipoTurgorCutaneo obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoTurgorCutaneo with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}