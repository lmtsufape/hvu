package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.RacaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.exception.ObjectNotFoundException;
import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.model.Raca;

@Service
@RequiredArgsConstructor
public class RacaService implements RacaServiceInterface {
	private final RacaRepository repository;


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

	public void deleteRaca(long id){
		Raca obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Raca"));
		repository.delete(obj);
	}	
	
	
	
}