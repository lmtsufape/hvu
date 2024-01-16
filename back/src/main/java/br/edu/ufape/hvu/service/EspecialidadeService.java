package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.EspecialidadeRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Especialidade;

@Service
public class EspecialidadeService implements EspecialidadeServiceInterface {
	@Autowired
	private EspecialidadeRepository repository;


	public Especialidade saveEspecialidade(Especialidade newInstance) {
		return repository.save(newInstance);
	}

	public Especialidade updateEspecialidade(Especialidade transientObject) {
		return repository.save(transientObject);
	}

	public Especialidade findEspecialidadeById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Especialidade"));
	}

	public List<Especialidade> getAllEspecialidade(){
		return repository.findAll();
	}

	public void deleteEspecialidade(Especialidade persistentObject){
		this.deleteEspecialidade(persistentObject.getId());
		
	}
	
	public void deleteEspecialidade(long id){
		Especialidade obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Especialidade with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}