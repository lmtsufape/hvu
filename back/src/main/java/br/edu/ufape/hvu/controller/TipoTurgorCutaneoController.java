package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.TipoTurgorCutaneo;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoTurgorCutaneoRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoTurgorCutaneoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class TipoTurgorCutaneoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tipoTurgorCutaneo")
	public List<TipoTurgorCutaneoResponse> getAllTipoTurgorCutaneo() {
		return facade.getAllTipoTurgorCutaneo()
			.stream()
			.map(TipoTurgorCutaneoResponse::new)
			.toList();
	}
	
	@PostMapping("tipoTurgorCutaneo")
	public TipoTurgorCutaneoResponse createTipoTurgorCutaneo(@Valid @RequestBody TipoTurgorCutaneoRequest newObj) {
		return new TipoTurgorCutaneoResponse(facade.saveTipoTurgorCutaneo(newObj.convertToEntity()));
	}
	
	@GetMapping("tipoTurgorCutaneo/{id}")
	public TipoTurgorCutaneoResponse getTipoTurgorCutaneoById(@PathVariable Long id) {
		try {
			return new TipoTurgorCutaneoResponse(facade.findTipoTurgorCutaneoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("tipoTurgorCutaneo/{id}")
	public TipoTurgorCutaneoResponse updateTipoTurgorCutaneo(@PathVariable Long id, @Valid @RequestBody TipoTurgorCutaneoRequest obj) {
		try {
			//TipoTurgorCutaneo o = obj.convertToEntity();
			TipoTurgorCutaneo oldObject = facade.findTipoTurgorCutaneoById(id);

			TypeMap<TipoTurgorCutaneoRequest, TipoTurgorCutaneo> typeMapper = modelMapper
													.typeMap(TipoTurgorCutaneoRequest.class, TipoTurgorCutaneo.class)
													.addMappings(mapper -> mapper.skip(TipoTurgorCutaneo::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TipoTurgorCutaneoResponse(facade.updateTipoTurgorCutaneo(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tipoTurgorCutaneo/{id}")
	public String deleteTipoTurgorCutaneo(@PathVariable Long id) {
		try {
			facade.deleteTipoTurgorCutaneo(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
