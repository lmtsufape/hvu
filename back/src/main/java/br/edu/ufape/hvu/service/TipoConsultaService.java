package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.TipoConsultaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.TipoConsulta;

@Service
public class TipoConsultaService implements TipoConsultaServiceInterface {
	@Autowired
	private TipoConsultaRepository repository;


	public TipoConsulta saveTipoConsulta(TipoConsulta newInstance) {
		return repository.save(newInstance);
	}

	public TipoConsulta updateTipoConsulta(TipoConsulta transientObject) {
		return repository.save(transientObject);
	}

	public TipoConsulta findTipoConsultaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "TipoConsulta"));
	}

	public List<TipoConsulta> getAllTipoConsulta(){
		return repository.findAll();
	}

	public void deleteTipoConsulta(TipoConsulta persistentObject){
		this.deleteTipoConsulta(persistentObject.getId());
		
	}
	
	public void deleteTipoConsulta(long id){
		TipoConsulta obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist TipoConsulta with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}