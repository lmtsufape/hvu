package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.RacaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.exception.ObjectNotFoundException;
import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.model.Raca;

@Service
public class RacaService implements RacaServiceInterface {
	@Autowired
	private RacaRepository repository;


	public Raca saveRaca(Raca newInstance) {
		return repository.save(newInstance);
	}

	public Raca updateRaca(Raca transientObject) {
		return repository.save(transientObject);
	}

	public Raca findRacaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Raca"));
	}

	public List<Raca> getAllRaca(){
		return repository.findAll();
	}
	
	public List<Raca> findByEspecie(Especie especie){
		List<Raca> raca = repository.findByEspecie(especie);
		if(raca.isEmpty()) {
			throw new ObjectNotFoundException("Raca");
		}
		return raca;
	} 

	public void deleteRaca(Raca persistentObject){
		this.deleteRaca(persistentObject.getId());
		
	}
	
	public void deleteRaca(long id){
		Raca obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Raca with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}