package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Foto;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.FotoRequest;
import br.edu.ufape.hvu.controller.dto.response.FotoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class FotoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("foto")
	public List<FotoResponse> getAllFoto() {
		return facade.getAllFoto()
			.stream()
			.map(FotoResponse::new)
			.toList();
	}
	
	@PostMapping("foto")
	public FotoResponse createFoto(@Valid @RequestBody FotoRequest newObj) {
		return new FotoResponse(facade.saveFoto(newObj.convertToEntity()));
	}
	
	@GetMapping("foto/{id}")
	public FotoResponse getFotoById(@PathVariable Long id) {
		try {
			return new FotoResponse(facade.findFotoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("foto/{id}")
	public FotoResponse updateFoto(@PathVariable Long id, @Valid @RequestBody FotoRequest obj) {
		try {
			//Foto o = obj.convertToEntity();
			Foto oldObject = facade.findFotoById(id);

			TypeMap<FotoRequest, Foto> typeMapper = modelMapper
													.typeMap(FotoRequest.class, Foto.class)
													.addMappings(mapper -> mapper.skip(Foto::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new FotoResponse(facade.updateFoto(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("foto/{id}")
	public String deleteFoto(@PathVariable Long id) {
		try {
			facade.deleteFoto(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
