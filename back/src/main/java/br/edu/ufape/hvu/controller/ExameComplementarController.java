package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.ExameComplementar;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.ExameComplementarRequest;
import br.edu.ufape.hvu.controller.dto.response.ExameComplementarResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class ExameComplementarController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("exameComplementar")
	public List<ExameComplementarResponse> getAllExameComplementar() {
		return facade.getAllExameComplementar()
			.stream()
			.map(ExameComplementarResponse::new)
			.toList();
	}
	
	@PostMapping("exameComplementar")
	public ExameComplementarResponse createExameComplementar(@Valid @RequestBody ExameComplementarRequest newObj) {
		return new ExameComplementarResponse(facade.saveExameComplementar(newObj.convertToEntity()));
	}
	
	@GetMapping("exameComplementar/{id}")
	public ExameComplementarResponse getExameComplementarById(@PathVariable Long id) {
		try {
			return new ExameComplementarResponse(facade.findExameComplementarById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("exameComplementar/{id}")
	public ExameComplementarResponse updateExameComplementar(@PathVariable Long id, @Valid @RequestBody ExameComplementarRequest obj) {
		try {
			//ExameComplementar o = obj.convertToEntity();
			ExameComplementar oldObject = facade.findExameComplementarById(id);

			TypeMap<ExameComplementarRequest, ExameComplementar> typeMapper = modelMapper
													.typeMap(ExameComplementarRequest.class, ExameComplementar.class)
													.addMappings(mapper -> mapper.skip(ExameComplementar::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new ExameComplementarResponse(facade.updateExameComplementar(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("exameComplementar/{id}")
	public String deleteExameComplementar(@PathVariable Long id) {
		try {
			facade.deleteExameComplementar(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
