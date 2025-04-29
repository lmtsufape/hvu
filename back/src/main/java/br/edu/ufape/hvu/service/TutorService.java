package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.exception.DuplicateAccountException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import br.edu.ufape.hvu.repository.TutorRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Tutor;

@Service
public class TutorService implements TutorServiceInterface {
	@Autowired
	private TutorRepository repository;

	public Tutor saveTutor(Tutor newInstance) throws ResponseStatusException {
		verificarDuplicidade(newInstance.getCpf(), newInstance.getEmail());
		if(repository.existsById(newInstance.getId())){
			throw new DuplicateAccountException("Tutor", "Id");
		}
		return repository.save(newInstance);
	}

	public Tutor updateTutor(Tutor transientObject) {
		return repository.save(transientObject);
	}

	public Tutor findTutorById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Tutor"));
	}
	
	public Tutor findTutorByanimalId(long animalId) {
		Tutor tutor = repository.findByanimalId(animalId);
		if (tutor == null) {
			throw new IdNotFoundException(animalId, "Tutor vinculado ao animal");
		}
		return tutor;
	}
	
	public Tutor findTutorByuserId(String userId) {
		Tutor tutor = repository.findByuserId(userId);
		if (tutor == null) {
			throw new IdNotFoundException(userId, "Tutor com userId");
		}
		return tutor;
	}

	public List<Tutor> getAllTutor(){
		return repository.findAll();
	}
	
	public void deleteTutor(long id){
		Tutor obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Tutor"));
		repository.delete(obj);
	}	
	
	public void verificarDuplicidade(String cpf, String email){
		if(repository.existsByCpf(cpf)){
			throw new DuplicateAccountException("Tutor", "CPF");
		}
		if(repository.existsByEmail(email)){
			throw new DuplicateAccountException("Tutor", "EMAIL");
		}
	}
	
}