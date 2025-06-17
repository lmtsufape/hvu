package br.edu.ufape.hvu.service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import br.edu.ufape.hvu.repository.CronogramaRepository;
import jakarta.transaction.Transactional;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Cronograma;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Horario;
import br.edu.ufape.hvu.model.Medico;

@Service
@RequiredArgsConstructor
public class CronogramaService implements CronogramaServiceInterface {
	private final CronogramaRepository repository;


	public Cronograma saveCronograma(Cronograma newInstance) {
		return repository.save(newInstance);
	}

	public Cronograma updateCronograma(Cronograma transientObject) {
		return repository.save(transientObject);
	}

	public Cronograma findCronogramaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Cronograma"));
	}
	@Transactional
	public List<Cronograma> findCronogramaByMedico(Medico medico) {
		try {
            return repository.findByMedico(medico);
        } catch (DataAccessException ex) {
            // Logar e lançar uma exceção mais específica ou tratar de acordo
            throw new ServiceException("Erro ao acessar o banco de dados", ex);
        }
	}

	public List<Cronograma> findCronogramaByEspecialidade(Especialidade especialidade) {
		try {
			return repository.findByEspecialidade(especialidade);
		} catch (DataAccessException ex) {
			throw new ServiceException("Erro ao acessar o banco de dados", ex);
        }
	}
	
	public List<Cronograma> getAllCronograma(){
		return repository.findAll();
	}
	
	public List<Cronograma> findByEspecialidadeAndDiaAndTurno(Especialidade especialidade, DayOfWeek dia, String turno) {
	    List<Cronograma> cronogramas = repository.findByEspecialidade(especialidade);
	    return cronogramas.stream()
	        .filter(c -> c.getHorarios() != null && c.getHorarios().containsKey(dia) && verifyByTurno(c.getHorarios().get(dia), turno))
	        .collect(Collectors.toList());
	}


    private boolean verifyByTurno(Horario horario, String turno) {
        if ("tarde".equalsIgnoreCase(turno)) {
            return horario.getFim().isAfter(LocalTime.of(12, 0)) || horario.getFim().equals(LocalTime.of(12, 0));
        } else { 
            return horario.getInicio().isBefore(LocalTime.of(12, 0));
        }
    }

	public void deleteCronograma(Cronograma persistentObject){
		this.deleteCronograma(persistentObject.getId());
		
	}
	
	public void deleteCronograma(long id){
		Cronograma obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Cronograma"));
		repository.delete(obj);
	}	
	
	
	
}