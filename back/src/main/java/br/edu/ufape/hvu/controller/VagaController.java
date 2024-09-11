package br.edu.ufape.hvu.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import java.time.LocalDate;
import java.util.Comparator;

import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.VagaCreateRequest;
import br.edu.ufape.hvu.controller.dto.request.VagaRequest;
import br.edu.ufape.hvu.controller.dto.response.VagaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class VagaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("vaga")
	public List<VagaResponse> getAllVaga() {
	    return facade.getAllVaga()
	            .stream()
	            .sorted(Comparator.comparing(Vaga::getDataHora)) // Ordenar as vagas por dataHora
	            .map(VagaResponse::new)
	            .toList();
	}
	
	@PostMapping("vaga")
	public VagaResponse createVaga(@Valid @RequestBody VagaRequest newObj) {
		return new VagaResponse(facade.saveVaga(newObj.convertToEntity()));
	}
	
	@GetMapping("vaga/{id}")
	public VagaResponse getVagaById(@PathVariable Long id) {
		try {
			return new VagaResponse(facade.findVagaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}

	@GetMapping("vaga/data/{date}")
	List<VagaResponse> getVagasByDay(@PathVariable LocalDate date){
		List<Vaga> vagas = facade.findVagaByData(date);
		return vagas
				.stream()
				.map(VagaResponse::new)
				.toList();
	}

	@GetMapping("vaga/data/{dataInicio}/{dataFinal}")
	List<VagaResponse> getVagaBetweenInicialDateAndFinal(@PathVariable LocalDate dataInicio, @PathVariable LocalDate dataFinal){
		List<Vaga> vagas = facade.findVagaBetweenInicialAndFinalDate(dataInicio, dataFinal);
		return vagas
				.stream()
				.map(VagaResponse::new)
				.toList();
	}
	
	@PatchMapping("vaga/{id}")
	public VagaResponse updateVaga(@PathVariable Long id, @Valid @RequestBody VagaRequest obj) {
		try {
			//Vaga o = obj.convertToEntity();
			Vaga oldObject = facade.findVagaById(id);

			if (obj.getTipoConsulta() != null) {
				oldObject.setTipoConsulta(facade.findTipoConsultaById(obj.getTipoConsulta().getId()));
				obj.setTipoConsulta(null);
			}

			if (obj.getEspecialidade() != null) {
				oldObject.setEspecialidade(facade.findEspecialidadeById(obj.getEspecialidade().getId()));
				obj.setEspecialidade(null);
			}

			if(obj.getMedico() != null){
				oldObject.setMedico(facade.findMedicoById(obj.getMedico().getId()));
				obj.setMedico(null);
			}

			TypeMap<VagaRequest, Vaga> typeMapper = modelMapper
													.typeMap(VagaRequest.class, Vaga.class)
													.addMappings(mapper -> mapper.skip(Vaga::setId));
													
			typeMapper.map(obj, oldObject);	
			
			
			return new VagaResponse(facade.updateVaga(oldObject));
			
			
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@PostMapping("/gestao-vagas/criar")
	public String createNewVagas(@Valid @RequestBody VagaCreateRequest newObj) {
		return facade.createVagasByTurno(newObj);

	}
	
	
	@DeleteMapping("vaga/{id}")
	public String deleteVaga(@PathVariable Long id) {
		try {
			facade.deleteVaga(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@GetMapping("vaga/especialidade/{idEspecialidade}")
	public List<VagaResponse> getVagasByEspecialidade(@PathVariable(value = "idEspecialidade") long idEspecialidade) {
		return facade.getVagasByEspecialidade(idEspecialidade)
				.stream()
				.map(VagaResponse::new)
				.toList();
	}
	
	@GetMapping("vaga/medico/{idMedico}/{data}")
	public List<VagaResponse> findVagasAndAgendamentoByMedico(@PathVariable long idMedico, @PathVariable LocalDate data) {
		return facade.findVagasAndAgendamentoByMedico(data, idMedico)
				.stream()
				.map(VagaResponse::new)
				.toList();
	}
	
	@GetMapping("vaga/agendamento/{idAgendamento}")
	public VagaResponse getVagaByAgendamento(@PathVariable(value = "idAgendamento") long idAgendamento) {
		return new VagaResponse(facade.getVagaByAgendamento(idAgendamento));
	}
}
