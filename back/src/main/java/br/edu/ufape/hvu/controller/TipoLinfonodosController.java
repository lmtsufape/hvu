package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.TipoLinfonodos;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoLinfonodosRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoLinfonodosResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class TipoLinfonodosController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tipoLinfonodos")
	public List<TipoLinfonodosResponse> getAllTipoLinfonodos() {
		return facade.getAllTipoLinfonodos()
			.stream()
			.map(TipoLinfonodosResponse::new)
			.toList();
	}
	
	@PostMapping("tipoLinfonodos")
	public TipoLinfonodosResponse createTipoLinfonodos(@Valid @RequestBody TipoLinfonodosRequest newObj) {
		return new TipoLinfonodosResponse(facade.saveTipoLinfonodos(newObj.convertToEntity()));
	}
	
	@GetMapping("tipoLinfonodos/{id}")
	public TipoLinfonodosResponse getTipoLinfonodosById(@PathVariable Long id) {
		try {
			return new TipoLinfonodosResponse(facade.findTipoLinfonodosById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("tipoLinfonodos/{id}")
	public TipoLinfonodosResponse updateTipoLinfonodos(@PathVariable Long id, @Valid @RequestBody TipoLinfonodosRequest obj) {
		try {
			//TipoLinfonodos o = obj.convertToEntity();
			TipoLinfonodos oldObject = facade.findTipoLinfonodosById(id);

			TypeMap<TipoLinfonodosRequest, TipoLinfonodos> typeMapper = modelMapper
													.typeMap(TipoLinfonodosRequest.class, TipoLinfonodos.class)
													.addMappings(mapper -> mapper.skip(TipoLinfonodos::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TipoLinfonodosResponse(facade.updateTipoLinfonodos(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tipoLinfonodos/{id}")
	public String deleteTipoLinfonodos(@PathVariable Long id) {
		try {
			facade.deleteTipoLinfonodos(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
