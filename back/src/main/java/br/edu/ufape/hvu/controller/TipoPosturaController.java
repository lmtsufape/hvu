package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.TipoPostura;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoPosturaRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoPosturaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class TipoPosturaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tipoPostura")
	public List<TipoPosturaResponse> getAllTipoPostura() {
		return facade.getAllTipoPostura()
			.stream()
			.map(TipoPosturaResponse::new)
			.toList();
	}
	
	@PostMapping("tipoPostura")
	public TipoPosturaResponse createTipoPostura(@Valid @RequestBody TipoPosturaRequest newObj) {
		return new TipoPosturaResponse(facade.saveTipoPostura(newObj.convertToEntity()));
	}
	
	@GetMapping("tipoPostura/{id}")
	public TipoPosturaResponse getTipoPosturaById(@PathVariable Long id) {
		try {
			return new TipoPosturaResponse(facade.findTipoPosturaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("tipoPostura/{id}")
	public TipoPosturaResponse updateTipoPostura(@PathVariable Long id, @Valid @RequestBody TipoPosturaRequest obj) {
		try {
			//TipoPostura o = obj.convertToEntity();
			TipoPostura oldObject = facade.findTipoPosturaById(id);

			TypeMap<TipoPosturaRequest, TipoPostura> typeMapper = modelMapper
													.typeMap(TipoPosturaRequest.class, TipoPostura.class)
													.addMappings(mapper -> mapper.skip(TipoPostura::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TipoPosturaResponse(facade.updateTipoPostura(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tipoPostura/{id}")
	public String deleteTipoPostura(@PathVariable Long id) {
		try {
			facade.deleteTipoPostura(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
