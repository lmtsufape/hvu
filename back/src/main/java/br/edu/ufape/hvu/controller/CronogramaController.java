package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Cronograma;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.CronogramaRequest;
import br.edu.ufape.hvu.controller.dto.response.CronogramaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class CronogramaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("cronograma")
	public List<CronogramaResponse> getAllCronograma() {
		return facade.getAllCronograma()
			.stream()
			.map(CronogramaResponse::new)
			.toList();
	}
	
	@PostMapping("cronograma")
	public CronogramaResponse createCronograma(@Valid @RequestBody CronogramaRequest newObj) {
		return new CronogramaResponse(facade.saveCronograma(newObj.convertToEntity()));
	}
	
	@GetMapping("cronograma/{id}")
	public CronogramaResponse getCronogramaById(@PathVariable Long id) {
		try {
			return new CronogramaResponse(facade.findCronogramaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("cronograma/{id}")
	public CronogramaResponse updateCronograma(@PathVariable Long id, @Valid @RequestBody CronogramaRequest obj) {
		try {
			//Cronograma o = obj.convertToEntity();
			Cronograma oldObject = facade.findCronogramaById(id);

			TypeMap<CronogramaRequest, Cronograma> typeMapper = modelMapper
													.typeMap(CronogramaRequest.class, Cronograma.class)
													.addMappings(mapper -> mapper.skip(Cronograma::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new CronogramaResponse(facade.updateCronograma(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("cronograma/{id}")
	public String deleteCronograma(@PathVariable Long id) {
		try {
			facade.deleteCronograma(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
