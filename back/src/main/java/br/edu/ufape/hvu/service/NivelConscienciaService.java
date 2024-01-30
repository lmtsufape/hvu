package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.NivelConscienciaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.NivelConsciencia;

@Service
public class NivelConscienciaService implements NivelConscienciaServiceInterface {
	@Autowired
	private NivelConscienciaRepository repository;


	public NivelConsciencia saveNivelConsciencia(NivelConsciencia newInstance) {
		return repository.save(newInstance);
	}

	public NivelConsciencia updateNivelConsciencia(NivelConsciencia transientObject) {
		return repository.save(transientObject);
	}

	public NivelConsciencia findNivelConscienciaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "NivelConsciencia"));
	}

	public List<NivelConsciencia> getAllNivelConsciencia(){
		return repository.findAll();
	}

	public void deleteNivelConsciencia(NivelConsciencia persistentObject){
		this.deleteNivelConsciencia(persistentObject.getId());
		
	}
	
	public void deleteNivelConsciencia(long id){
		NivelConsciencia obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "NivelConsciencia"));
		repository.delete(obj);
	}	
	
	
	
}