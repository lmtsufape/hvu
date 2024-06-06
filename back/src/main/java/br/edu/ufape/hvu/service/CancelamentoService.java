package br.edu.ufape.hvu.service;

import java.util.List;

import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Cancelamento;
import br.edu.ufape.hvu.repository.CancelamentoRepository;

@Service
public class CancelamentoService implements CancelamentoServiceInterface {
	@Autowired
	private CancelamentoRepository repository;


	public Cancelamento saveCancelamento(Cancelamento newInstance) {
		return repository.save(newInstance);
	}

	public Cancelamento updateCancelamento(Cancelamento transientObject) {
		return repository.save(transientObject);
	}

	public Cancelamento findCancelamentoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Cancelamento"));
	}

	public List<Cancelamento> findCancelamentosByTutorId(long tutorId) {
		try {
			return repository.findCancelamentosByTutorId(tutorId);
		} catch (RuntimeException e) {
			throw new ServiceException("Erro ao buscar os cancelamentos", e);
		}
	}

	public List<Cancelamento> getAllCancelamento(){
		return repository.findAll();
	}

	public void deleteCancelamento(Cancelamento persistentObject){
		this.deleteCancelamento(persistentObject.getId());
		
	}
	
	public void deleteCancelamento(long id){
		Cancelamento obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Cancelamento"));
		repository.delete(obj);
	}	
	
	
	
}