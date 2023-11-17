package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.MedicoRepository;
import br.edu.ufape.hvu.model.Medico;

@Service
public class MedicoService implements MedicoServiceInterface {
	@Autowired
	private MedicoRepository repository;


	public Medico saveMedico(Medico newInstance) {
		return repository.save(newInstance);
	}

	public Medico updateMedico(Medico transientObject) {
		return repository.save(transientObject);
	}

	public Medico findMedicoById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Medico with id = " + id));
	}

	public List<Medico> getAllMedico(){
		return repository.findAll();
	}

	public void deleteMedico(Medico persistentObject){
		this.deleteMedico(persistentObject.getId());
		
	}
	
	public void deleteMedico(long id){
		Medico obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Medico with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}