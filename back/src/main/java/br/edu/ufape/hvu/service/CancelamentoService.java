package br.edu.ufape.hvu.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Cancelamento;
import br.edu.ufape.hvu.repository.CancelamentoRepository;

@Service
@RequiredArgsConstructor
public class CancelamentoService implements CancelamentoServiceInterface {
	private final CancelamentoRepository repository;

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
		return repository.findCancelamentosByTutorId(tutorId);
	}

	public List<Cancelamento> getAllCancelamento(){
		return repository.findAll();
	}
	
	public void deleteCancelamento(long id){
		Cancelamento obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Cancelamento"));
		repository.delete(obj);
	}	
	
	
	
}