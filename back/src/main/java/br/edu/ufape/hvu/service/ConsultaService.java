package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.ConsultaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Consulta;

@Service
@RequiredArgsConstructor
public class ConsultaService implements ConsultaServiceInterface {
	private final ConsultaRepository repository;

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

	public List<Consulta> getConsultasByAnimalFichaNumero(String animalFichaNumero){
		return repository.findConsultasByAnimalFichaNumero(animalFichaNumero);
	}

	@Override
	public List<Consulta> getConsultasByAnimalId(Long id) {
		return repository.findConsultasByAnimalId(id);
	}

	public void deleteConsulta(long id){
		Consulta obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Consulta"));
		repository.delete(obj);
	}	
	
	
	
}