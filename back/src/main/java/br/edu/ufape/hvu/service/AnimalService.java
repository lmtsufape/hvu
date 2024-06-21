package br.edu.ufape.hvu.service;

import java.util.List;

import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AnimalRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Animal;

@Service
public class AnimalService implements AnimalServiceInterface {
	@Autowired
	private AnimalRepository repository;


	public Animal saveAnimal(Animal newInstance) {
		return repository.save(newInstance);
	}

	public Animal updateAnimal(Animal transientObject) {
		return repository.save(transientObject);
	}

	public Animal findAnimalById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Animal"));
	}

	public List<Animal> getAllAnimal(){
		return repository.findAll();
	}


	public List<Animal> findAnimalByFichaNumber(String fichaNumber) {
		try {
			return repository.findAnimalByFicha(fichaNumber);
		} catch (RuntimeException e) {
			throw new ServiceException("Erro ao buscar animal por meio do numero da ficha");
		}
	}


	public void deleteAnimal(Animal persistentObject){
		this.deleteAnimal(persistentObject.getId());
		
	}
	
	public void deleteAnimal(long id){
		Animal obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Animal"));
		repository.delete(obj);
	}	
	
	
	
}