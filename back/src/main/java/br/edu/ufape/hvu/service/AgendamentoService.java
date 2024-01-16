package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Agendamento;

@Service
public class AgendamentoService implements AgendamentoServiceInterface {
	@Autowired
	private AgendamentoRepository repository;


	public Agendamento saveAgendamento(Agendamento newInstance) {
		return repository.save(newInstance);
	}

	public Agendamento updateAgendamento(Agendamento transientObject) {
		return repository.save(transientObject);
	}

	public Agendamento findAgendamentoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Agendamento"));
	}

	public List<Agendamento> getAllAgendamento(){
		return repository.findAll();
	}

	public void deleteAgendamento(Agendamento persistentObject){
		this.deleteAgendamento(persistentObject.getId());
		
	}
	
	public void deleteAgendamento(long id){
		Agendamento obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Agendamento with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}