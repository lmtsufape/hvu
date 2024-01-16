package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.ConsultaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Consulta;

@Service
public class ConsultaService implements ConsultaServiceInterface {
	@Autowired
	private ConsultaRepository repository;


	public Consulta saveConsulta(Consulta newInstance) {
		return repository.save(newInstance);
	}

	public Consulta updateConsulta(Consulta transientObject) {
		return repository.save(transientObject);
	}

	public Consulta findConsultaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Consulta"));
	}

	public List<Consulta> getAllConsulta(){
		return repository.findAll();
	}

	public void deleteConsulta(Consulta persistentObject){
		this.deleteConsulta(persistentObject.getId());
		
	}
	
	public void deleteConsulta(long id){
		Consulta obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Consulta with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}