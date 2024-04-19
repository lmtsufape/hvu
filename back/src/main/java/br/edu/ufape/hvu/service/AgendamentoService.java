package br.edu.ufape.hvu.service;

import java.util.List;

import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Animal;

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
	
	public List<Agendamento> findAgendamentosByMedicoId(Long medicoId){
		try {
			return repository.findAgendamentosByMedicoId(medicoId);
		} catch (RuntimeException ex) {
			throw new ServiceException("Erro ao buscar os Agendamentos", ex);
        }
	}
	
	public List<Agendamento> findAgendamentosByAnimal(Animal animal){
		try {
			return repository.findByAnimal(animal);
		} catch (RuntimeException ex) {
			throw new ServiceException("Erro ao buscar os Agendamentos", ex);
        }
	}

	public List<Agendamento> getAllAgendamento(){
		return repository.findAll();
	}

	public void deleteAgendamento(Agendamento persistentObject){
		this.deleteAgendamento(persistentObject.getId());
		
	}
	
	public void deleteAgendamento(long id){
		Agendamento obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Agendamento"));
		repository.delete(obj);
	}	
	
	
	
}