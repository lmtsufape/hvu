package br.edu.ufape.hvu.service;

import java.util.List;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;

public interface AnimalServiceInterface {
	Animal saveAnimal(Animal o);
	Animal findAnimalById(long id);
	Animal updateAnimal(Animal u);
	void deleteAnimal(long id);
	List<Animal> getAllAnimal();
	Animal findAnimalByFichaNumber (String fichaNumber);
	List<Animal> findAnimalsByOrigemAnimal(OrigemAnimal origem);
}