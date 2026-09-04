package br.edu.ufape.hvu.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import br.edu.ufape.hvu.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import br.edu.ufape.hvu.controller.dto.response.AnimalERacaPorOrigemResponse;

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
		return repository.findById(id).orElseThrow(() -> new IdNotFoundException(id, "Animal"));
	}

	public List<AnimalERacaPorOrigemResponse> findAnimaisERacasPorOrigem(OrigemAnimal origem) {
		return repository.findAnimaisERacasPorOrigem(origem);
	}

	public List<Animal> getAllAnimal() {
		return repository.findAll();
	}

	public void deleteAnimal(long id) {
		Animal obj = repository.findById(id).orElseThrow(
				() -> new IdNotFoundException(id, "Animal"));
		repository.delete(obj);
	}

	public List<Animal> findAnimalsByOrigemAnimal(OrigemAnimal origem) {
		return repository.findByOrigemAnimal(origem);
	}

}