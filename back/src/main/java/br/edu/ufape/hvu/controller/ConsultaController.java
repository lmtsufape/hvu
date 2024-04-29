package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Consulta;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.ConsultaRequest;
import br.edu.ufape.hvu.controller.dto.response.ConsultaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class ConsultaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("consulta")
	public List<ConsultaResponse> getAllConsulta() {
		return facade.getAllConsulta()
			.stream()
			.map(ConsultaResponse::new)
			.toList();
	}
	
	@PostMapping("consulta")
	public ConsultaResponse createConsulta(@Valid @RequestBody ConsultaRequest newObj) {
		return new ConsultaResponse(facade.saveConsulta(newObj.convertToEntity()));
	}
	
	@GetMapping("consulta/{id}")
	public ConsultaResponse getConsultaById(@PathVariable Long id) {
		try {
			return new ConsultaResponse(facade.findConsultaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("consulta/{id}")
	public ConsultaResponse updateConsulta(@PathVariable Long id, @Valid @RequestBody ConsultaRequest obj) {
		try {
			//Consulta o = obj.convertToEntity();
			Consulta oldObject = facade.findConsultaById(id);

			if (obj.getMedico() != null) {
				oldObject.setMedico(obj.getMedico().convertToEntity());
				obj.setMedico(null);
			}

			if (obj.getEncaminhamento() != null) {
				oldObject.setEncaminhamento(obj.getEncaminhamento().convertToEntity());
				obj.setEncaminhamento(null);
			}

			if (obj.getPrescricao() != null) {
				oldObject.setPrescricao(obj.convertToEntity().getPrescricao());
				obj.setPrescricao(null);
			}

			TypeMap<ConsultaRequest, Consulta> typeMapper = modelMapper
													.typeMap(ConsultaRequest.class, Consulta.class)
													.addMappings(mapper -> mapper.skip(Consulta::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new ConsultaResponse(facade.updateConsulta(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("consulta/{id}")
	public String deleteConsulta(@PathVariable Long id) {
		try {
			facade.deleteConsulta(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
