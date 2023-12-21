package br.edu.ufape.hvu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ufape.hvu.repository.TutorRepository;
import br.edu.ufape.hvu.model.Tutor;

@Service
public class TutorService implements TutorServiceInterface {
	@Autowired
	private TutorRepository repository;


	public Tutor saveTutor(Tutor newInstance) throws ResponseStatusException {
		Tutor tutorSalvo = repository.findByuserId(newInstance.getUserId());
		if (tutorSalvo != null) {
		    throw new ResponseStatusException(HttpStatus.CONFLICT, "This Tutor account is already in use.");
		} else {
			return repository.save(newInstance);
		}
	}

	public Tutor updateTutor(Tutor transientObject) {
		return repository.save(transientObject);
	}

	public Tutor findTutorById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Tutor with id = " + id));
	}
	
	public Tutor findTutorByanimalId(long animalId) {
		try {
			return repository.findByanimalId(animalId);
		} catch (RuntimeException ex){
			throw new RuntimeException ("It doesn't exist Tutor with id = " + animalId);
		}
	}
	
	public Tutor findTutorByuserId(String userId) {
		try {
			return repository.findByuserId(userId);
		} catch (RuntimeException ex){
			throw new RuntimeException ("It doesn't exist Tutor with id = " + userId);
		}
	}

	public List<Tutor> getAllTutor(){
		return repository.findAll();
	}

	public void deleteTutor(Tutor persistentObject){
		this.deleteTutor(persistentObject.getId());
		
	}
	
	public void deleteTutor(long id){
		Tutor obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Tutor with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}