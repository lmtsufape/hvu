package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.enums.Ficha;

public interface AnimalServiceInterface {
	Animal saveAnimal(Animal o);
	Animal findAnimalById(long id);
	Animal updateAnimal(Animal u);
	void deleteAnimal(Animal u);
	void deleteAnimal(long id);
	List<Animal> getAllAnimal();
	List<Animal> findAnimalByFichaNumber (String fichaNumber);
}