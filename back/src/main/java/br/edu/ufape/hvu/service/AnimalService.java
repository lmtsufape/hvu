package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AnimalRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Animal;

@Service
@RequiredArgsConstructor
public class AnimalService implements AnimalServiceInterface {
	private final AnimalRepository repository;

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

	public Animal findAnimalByFichaNumber(String fichaNumber) {
		try {
			Animal animal = repository.findAnimalByFicha(fichaNumber);
			if (animal == null) {
				throw new ResourceNotFoundException("Animal", "ficha", fichaNumber);
			}
			return animal;
		} catch (Exception e) {
			throw new RuntimeException("Erro ao buscar animal pelo número da ficha: " + fichaNumber, e);
		}
	}

	public void deleteAnimal(long id){
		Animal obj = repository.findById(id).orElseThrow(
				() -> new IdNotFoundException(id, "Animal"));
		repository.delete(obj);
	}
	
}