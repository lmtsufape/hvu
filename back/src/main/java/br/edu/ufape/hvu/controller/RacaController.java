package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Raca;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.RacaRequest;
import br.edu.ufape.hvu.controller.dto.response.RacaResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class RacaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("raca")
	public List<RacaResponse> getAllRaca() {
		return facade.getAllRaca()
			.stream()
			.map(RacaResponse::new)
			.toList();
	}
	
	@PostMapping("raca")
	public RacaResponse createRaca(@Valid @RequestBody RacaRequest newObj) {
		return new RacaResponse(facade.saveRaca(newObj.convertToEntity()));
	}
	
	@GetMapping("raca/{id}")
	public RacaResponse getRacaById(@PathVariable Long id) {
		try {
			return new RacaResponse(facade.findRacaById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Raca " + id + " not found.");
		}
	}
	
	@PatchMapping("raca/{id}")
	public RacaResponse updateRaca(@PathVariable Long id, @Valid @RequestBody RacaRequest obj) {
		try {
			//Raca o = obj.convertToEntity();
			Raca oldObject = facade.findRacaById(id);

			TypeMap<RacaRequest, Raca> typeMapper = modelMapper
													.typeMap(RacaRequest.class, Raca.class)
													.addMappings(mapper -> mapper.skip(Raca::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new RacaResponse(facade.updateRaca(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("raca/{id}")
	public String deleteRaca(@PathVariable Long id) {
		try {
			facade.deleteRaca(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
