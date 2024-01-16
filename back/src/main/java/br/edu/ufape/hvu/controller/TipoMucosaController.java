package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.TipoMucosa;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoMucosaRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoMucosaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class TipoMucosaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tipoMucosa")
	public List<TipoMucosaResponse> getAllTipoMucosa() {
		return facade.getAllTipoMucosa()
			.stream()
			.map(TipoMucosaResponse::new)
			.toList();
	}
	
	@PostMapping("tipoMucosa")
	public TipoMucosaResponse createTipoMucosa(@Valid @RequestBody TipoMucosaRequest newObj) {
		return new TipoMucosaResponse(facade.saveTipoMucosa(newObj.convertToEntity()));
	}
	
	@GetMapping("tipoMucosa/{id}")
	public TipoMucosaResponse getTipoMucosaById(@PathVariable Long id) {
		try {
			return new TipoMucosaResponse(facade.findTipoMucosaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("tipoMucosa/{id}")
	public TipoMucosaResponse updateTipoMucosa(@PathVariable Long id, @Valid @RequestBody TipoMucosaRequest obj) {
		try {
			//TipoMucosa o = obj.convertToEntity();
			TipoMucosa oldObject = facade.findTipoMucosaById(id);

			TypeMap<TipoMucosaRequest, TipoMucosa> typeMapper = modelMapper
													.typeMap(TipoMucosaRequest.class, TipoMucosa.class)
													.addMappings(mapper -> mapper.skip(TipoMucosa::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TipoMucosaResponse(facade.updateTipoMucosa(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tipoMucosa/{id}")
	public String deleteTipoMucosa(@PathVariable Long id) {
		try {
			facade.deleteTipoMucosa(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
