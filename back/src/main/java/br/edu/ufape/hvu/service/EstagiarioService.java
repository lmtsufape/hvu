package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.EstagiarioRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Estagiario;

@Service
public class EstagiarioService implements EstagiarioServiceInterface {
	@Autowired
	private EstagiarioRepository repository;


	public Estagiario saveEstagiario(Estagiario newInstance) {
		return repository.save(newInstance);
	}

	public Estagiario updateEstagiario(Estagiario transientObject) {
		return repository.save(transientObject);
	}

	public Estagiario findEstagiarioById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Estagiario"));
	}

	public List<Estagiario> getAllEstagiario(){
		return repository.findAll();
	}

	public void deleteEstagiario(Estagiario persistentObject){
		this.deleteEstagiario(persistentObject.getId());
		
	}
	
	public void deleteEstagiario(long id){
		Estagiario obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Estagiario with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}