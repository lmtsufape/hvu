package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.EtapaRepository;
import br.edu.ufape.hvu.model.Etapa;

@Service
public class EtapaService implements EtapaServiceInterface {
	@Autowired
	private EtapaRepository repository;


	public Etapa saveEtapa(Etapa newInstance) {
		return repository.save(newInstance);
	}

	public Etapa updateEtapa(Etapa transientObject) {
		return repository.save(transientObject);
	}

	public Etapa findEtapaById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Etapa with id = " + id));
	}

	public List<Etapa> getAllEtapa(){
		return repository.findAll();
	}

	public void deleteEtapa(Etapa persistentObject){
		this.deleteEtapa(persistentObject.getId());
		
	}
	
	public void deleteEtapa(long id){
		Etapa obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Etapa with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}