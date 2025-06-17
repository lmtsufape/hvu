package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.EtapaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Etapa;

@Service
@RequiredArgsConstructor
public class EtapaService implements EtapaServiceInterface {
	private final EtapaRepository repository;


	public Etapa saveEtapa(Etapa newInstance) {
		return repository.save(newInstance);
	}

	public Etapa updateEtapa(Etapa transientObject) {
		return repository.save(transientObject);
	}

	public Etapa findEtapaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Etapa"));
	}

	public List<Etapa> getAllEtapa(){
		return repository.findAll();
	}

	public void deleteEtapa(Etapa persistentObject){
		this.deleteEtapa(persistentObject.getId());
		
	}
	
	public void deleteEtapa(long id){
		Etapa obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Etapa"));
		repository.delete(obj);
	}	
	
	
	
}