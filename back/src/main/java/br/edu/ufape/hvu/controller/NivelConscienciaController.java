package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.NivelConsciencia;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.NivelConscienciaRequest;
import br.edu.ufape.hvu.controller.dto.response.NivelConscienciaResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class NivelConscienciaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("nivelConsciencia")
	public List<NivelConscienciaResponse> getAllNivelConsciencia() {
		return facade.getAllNivelConsciencia()
			.stream()
			.map(NivelConscienciaResponse::new)
			.toList();
	}
	
	@PostMapping("nivelConsciencia")
	public NivelConscienciaResponse createNivelConsciencia(@Valid @RequestBody NivelConscienciaRequest newObj) {
		return new NivelConscienciaResponse(facade.saveNivelConsciencia(newObj.convertToEntity()));
	}
	
	@GetMapping("nivelConsciencia/{id}")
	public NivelConscienciaResponse getNivelConscienciaById(@PathVariable Long id) {
		try {
			return new NivelConscienciaResponse(facade.findNivelConscienciaById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "NivelConsciencia " + id + " not found.");
		}
	}
	
	@PatchMapping("nivelConsciencia/{id}")
	public NivelConscienciaResponse updateNivelConsciencia(@PathVariable Long id, @Valid @RequestBody NivelConscienciaRequest obj) {
		try {
			//NivelConsciencia o = obj.convertToEntity();
			NivelConsciencia oldObject = facade.findNivelConscienciaById(id);

			TypeMap<NivelConscienciaRequest, NivelConsciencia> typeMapper = modelMapper
													.typeMap(NivelConscienciaRequest.class, NivelConsciencia.class)
													.addMappings(mapper -> mapper.skip(NivelConsciencia::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new NivelConscienciaResponse(facade.updateNivelConsciencia(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("nivelConsciencia/{id}")
	public String deleteNivelConsciencia(@PathVariable Long id) {
		try {
			facade.deleteNivelConsciencia(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
