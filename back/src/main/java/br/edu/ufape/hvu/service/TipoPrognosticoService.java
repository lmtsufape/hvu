package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.TipoPrognosticoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.TipoPrognostico;

@Service
public class TipoPrognosticoService implements TipoPrognosticoServiceInterface {
	@Autowired
	private TipoPrognosticoRepository repository;


	public TipoPrognostico saveTipoPrognostico(TipoPrognostico newInstance) {
		return repository.save(newInstance);
	}

	public TipoPrognostico updateTipoPrognostico(TipoPrognostico transientObject) {
		return repository.save(transientObject);
	}

	public TipoPrognostico findTipoPrognosticoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "TipoPrognostico"));
	}

	public List<TipoPrognostico> getAllTipoPrognostico(){
		return repository.findAll();
	}

	public void deleteTipoPrognostico(TipoPrognostico persistentObject){
		this.deleteTipoPrognostico(persistentObject.getId());
		
	}
	
	public void deleteTipoPrognostico(long id){
		TipoPrognostico obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "TipoPrognostico"));
		repository.delete(obj);
	}	
	
	
	
}