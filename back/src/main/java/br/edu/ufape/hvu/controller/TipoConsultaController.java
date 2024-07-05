package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.TipoConsulta;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoConsultaRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoConsultaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class TipoConsultaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tipoConsulta")
	public List<TipoConsultaResponse> getAllTipoConsulta() {
		return facade.getAllTipoConsulta()
			.stream()
			.map(TipoConsultaResponse::new)
			.toList();
	}
	
	@PostMapping("tipoConsulta")
	public TipoConsultaResponse createTipoConsulta(@Valid @RequestBody TipoConsultaRequest newObj) {
		return new TipoConsultaResponse(facade.saveTipoConsulta(newObj.convertToEntity()));
	}
	
	@GetMapping("tipoConsulta/{id}")
	public TipoConsultaResponse getTipoConsultaById(@PathVariable Long id) {
		try {
			return new TipoConsultaResponse(facade.findTipoConsultaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("tipoConsulta/{id}")
	public TipoConsultaResponse updateTipoConsulta(@PathVariable Long id, @Valid @RequestBody TipoConsultaRequest obj) {
		try {
			//TipoConsulta o = obj.convertToEntity();
			TipoConsulta oldObject = facade.findTipoConsultaById(id);

			TypeMap<TipoConsultaRequest, TipoConsulta> typeMapper = modelMapper
													.typeMap(TipoConsultaRequest.class, TipoConsulta.class)
													.addMappings(mapper -> mapper.skip(TipoConsulta::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TipoConsultaResponse(facade.updateTipoConsulta(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tipoConsulta/{id}")
	public String deleteTipoConsulta(@PathVariable Long id) {
		try {
			facade.deleteTipoConsulta(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
