package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.AgendamentoRequest;
import br.edu.ufape.hvu.controller.dto.response.AgendamentoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class AgendamentoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("agendamento")
	public List<AgendamentoResponse> getAllAgendamento() {
		return facade.getAllAgendamento()
			.stream()
			.map(AgendamentoResponse::new)
			.toList();
	}
	
	@PostMapping("agendamento/vaga/{idVaga}")
	public AgendamentoResponse createAgendamento(@Valid @RequestBody AgendamentoRequest newObj, @PathVariable Long idVaga) {
		return new AgendamentoResponse(facade.saveAgendamento(newObj.convertToEntity(),idVaga));
	}
	
	@GetMapping("agendamento/{id}")
	public AgendamentoResponse getAgendamentoById(@PathVariable Long id) {
		try {
			return new AgendamentoResponse(facade.findAgendamentoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("agendamento/{id}")
	public AgendamentoResponse updateAgendamento(@PathVariable Long id, @Valid @RequestBody AgendamentoRequest obj) {
		try {
			//Agendamento o = obj.convertToEntity();
			Agendamento oldObject = facade.findAgendamentoById(id);

			TypeMap<AgendamentoRequest, Agendamento> typeMapper = modelMapper
													.typeMap(AgendamentoRequest.class, Agendamento.class)
													.addMappings(mapper -> mapper.skip(Agendamento::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new AgendamentoResponse(facade.updateAgendamento(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("agendamento/{id}")
	public String deleteAgendamento(@PathVariable Long id) {
		try {
			facade.deleteAgendamento(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
