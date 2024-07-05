package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.TipoExame;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoExameRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoExameResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class TipoExameController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tipoExame")
	public List<TipoExameResponse> getAllTipoExame() {
		return facade.getAllTipoExame()
			.stream()
			.map(TipoExameResponse::new)
			.toList();
	}
	
	@PostMapping("tipoExame")
	public TipoExameResponse createTipoExame(@Valid @RequestBody TipoExameRequest newObj) {
		return new TipoExameResponse(facade.saveTipoExame(newObj.convertToEntity()));
	}
	
	@GetMapping("tipoExame/{id}")
	public TipoExameResponse getTipoExameById(@PathVariable Long id) {
		try {
			return new TipoExameResponse(facade.findTipoExameById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("tipoExame/{id}")
	public TipoExameResponse updateTipoExame(@PathVariable Long id, @Valid @RequestBody TipoExameRequest obj) {
		try {
			//TipoExame o = obj.convertToEntity();
			TipoExame oldObject = facade.findTipoExameById(id);

			TypeMap<TipoExameRequest, TipoExame> typeMapper = modelMapper
													.typeMap(TipoExameRequest.class, TipoExame.class)
													.addMappings(mapper -> mapper.skip(TipoExame::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TipoExameResponse(facade.updateTipoExame(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tipoExame/{id}")
	public String deleteTipoExame(@PathVariable Long id) {
		try {
			facade.deleteTipoExame(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
