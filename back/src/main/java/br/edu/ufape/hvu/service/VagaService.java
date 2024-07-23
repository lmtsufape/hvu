package br.edu.ufape.hvu.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.VagaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.model.Vaga;

@Service
public class VagaService implements VagaServiceInterface {
	@Autowired
	private VagaRepository repository;

	public Vaga saveVaga(Vaga newInstance) {
		return repository.save(newInstance);
	}

	public Vaga updateVaga(Vaga transientObject) {
		return repository.save(transientObject);
	}

	public Vaga findVagaById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Vaga"));
	}

	public List<Vaga> getAllVaga(){
		return repository.findAll();
	}
	
	public List<Vaga> findVagasByData(LocalDate data) {
        LocalDateTime begin = data.atStartOfDay(); 
        LocalDateTime end = data.plusDays(1).atStartOfDay().minusSeconds(1); 
        
        return repository.findByData(begin, end);
    }
	
	public List<Vaga> findVagasAndAgendamentoByMedico (LocalDate data, Medico medico){
		LocalDateTime end =  data.plusDays(1).atStartOfDay().minusSeconds(1); 
        LocalDateTime begin = data.atStartOfDay(); 
		
		return repository.findVagasByDataHoraBetweenAndMedicoAndAgendamentoNotNull(begin, end, medico);
	}
	
	public List<Vaga> findVagasByDataAndEspecialidade(LocalDate data, Especialidade especialidade) {
        LocalDateTime begin = data.atStartOfDay(); 
        LocalDateTime end = data.plusDays(1).atStartOfDay().minusSeconds(1); 
        
        return repository.findByDataAndEspecialidade(begin, end, especialidade);
    }
	
	public List<Vaga> findVagasByDataAndEspecialidadeAndMedico(LocalDate data, Especialidade especialidade, Medico medico) {
        LocalDateTime begin = data.atStartOfDay();
        LocalDateTime end = data.plusDays(1).atStartOfDay().minusSeconds(1); 
        
        return repository.findByDataAndEspecialidadeAndMedico(begin, end, especialidade, medico);
    }
	
	public List<Vaga> findVagasByDataAndTurno(LocalDate data, String turno) {
        LocalDateTime begin, end;

        if ("Manhã".equalsIgnoreCase(turno)) {
            begin = data.atTime(6, 0); 
            end = data.atTime(11, 59); 
        } else if ("Tarde".equalsIgnoreCase(turno)) {
            begin = data.atTime(12, 0); 
            end = data.atTime(19, 59); 
        } else {
            throw new IllegalArgumentException("Turno não reconhecido. Use 'Manhã' ou 'Tarde'.");
        }
        
        return repository.findByData(begin, end);
	}

	public void deleteVaga(Vaga persistentObject){
		this.deleteVaga(persistentObject.getId());
		
	}
	
	public void deleteVaga(long id){
		Vaga obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Vaga"));
		repository.delete(obj);
	}

	
	public List<Vaga> findVagaByEspecialidade(Especialidade especialidade) {
		return repository.findByEspecialidade(especialidade);
	}
	
	public List<Vaga> findLatestVagaForEachAnimal(){
		return repository.findLatestVagaForEachAnimal();
	}
	
	public List<Vaga> findLatestVagaForEachAnimalNotReturn(){
		return repository.findLatestVagaForEachAnimalNotReturn();
	}

	public List<Vaga> findVagaBetweenInicialAndFinalDate(LocalDate dataInicial, LocalDate dataFinal) {
		LocalDateTime inicio = dataInicial.atStartOfDay();
		LocalDateTime fim = dataFinal.atTime(23, 59, 59);
		return repository.findByDataHoraBetween(inicio, fim);
	}

	public Vaga findVagaByAgendamento(Agendamento agendamento) {
		return repository.findByAgendamento(agendamento);
	}	
	
	
	
}