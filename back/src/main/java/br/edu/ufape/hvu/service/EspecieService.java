package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.EspecieRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Especie;

@Service
@RequiredArgsConstructor
public class EspecieService implements EspecieServiceInterface {
	private final EspecieRepository repository;


	public Especie saveEspecie(Especie newInstance) {
		return repository.save(newInstance);
	}

	public Especie updateEspecie(Especie transientObject) {
		return repository.save(transientObject);
	}

	public Especie findEspecieById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Especie"));
	}

	public List<Especie> getAllEspecie(){
		return repository.findAll();
	}

	public void deleteEspecie(Especie persistentObject){
		this.deleteEspecie(persistentObject.getId());
		
	}
	
	public void deleteEspecie(long id){
		Especie obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Especie"));
		repository.delete(obj);
	}	
	
	
	
}