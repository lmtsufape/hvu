package br.edu.ufape.hvu.service;

import java.util.List;
import br.edu.ufape.hvu.model.Tutor;

public interface TutorServiceInterface {
	Tutor saveTutor(Tutor o);
	Tutor findTutorById(long id);
	Tutor findTutorByUserId(String userId);
	Tutor findTutorByAnimalId(long animalId);
	Tutor updateTutor(Tutor u);
	void deleteTutor(long id);
	List<Tutor> getAllTutor();
	void verificarDuplicidade(String cpf, String email);
    Tutor getOrCreateAnonymousTutor();
}