package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Tutor;

public interface TutorServiceInterface {
	Tutor saveTutor(Tutor o);
	Tutor findTutorById(long id);
	Tutor findTutorByuserId(String userId);
	Tutor findTutorByanimalId(long animalId);
	Tutor updateTutor(Tutor u);
	void deleteTutor(Tutor u);
	void deleteTutor(long id);
	List<Tutor> getAllTutor();
    
    

    
}