package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.LivroRegistroRepository;
import br.edu.ufape.hvu.model.LivroRegistro;

@Service
public class LivroRegistroService implements LivroRegistroServiceInterface {
	@Autowired
	private LivroRegistroRepository repository;


	public LivroRegistro saveLivroRegistro(LivroRegistro newInstance) {
		return repository.save(newInstance);
	}

	public LivroRegistro updateLivroRegistro(LivroRegistro transientObject) {
		return repository.save(transientObject);
	}

	public LivroRegistro findLivroRegistroById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist LivroRegistro with id = " + id));
	}

	public List<LivroRegistro> getAllLivroRegistro(){
		return repository.findAll();
	}

	public void deleteLivroRegistro(LivroRegistro persistentObject){
		this.deleteLivroRegistro(persistentObject.getId());
		
	}
	
	public void deleteLivroRegistro(long id){
		LivroRegistro obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist LivroRegistro with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}