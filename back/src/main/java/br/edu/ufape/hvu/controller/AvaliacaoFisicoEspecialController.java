package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.AvaliacaoFisicoEspecial;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.AvaliacaoFisicoEspecialRequest;
import br.edu.ufape.hvu.controller.dto.response.AvaliacaoFisicoEspecialResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class AvaliacaoFisicoEspecialController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("avaliacaoFisicoEspecial")
	public List<AvaliacaoFisicoEspecialResponse> getAllAvaliacaoFisicoEspecial() {
		return facade.getAllAvaliacaoFisicoEspecial()
			.stream()
			.map(AvaliacaoFisicoEspecialResponse::new)
			.toList();
	}
	
	@PostMapping("avaliacaoFisicoEspecial")
	public AvaliacaoFisicoEspecialResponse createAvaliacaoFisicoEspecial(@Valid @RequestBody AvaliacaoFisicoEspecialRequest newObj) {
		return new AvaliacaoFisicoEspecialResponse(facade.saveAvaliacaoFisicoEspecial(newObj.convertToEntity()));
	}
	
	@GetMapping("avaliacaoFisicoEspecial/{id}")
	public AvaliacaoFisicoEspecialResponse getAvaliacaoFisicoEspecialById(@PathVariable Long id) {
		try {
			return new AvaliacaoFisicoEspecialResponse(facade.findAvaliacaoFisicoEspecialById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "AvaliacaoFisicoEspecial " + id + " not found.");
		}
	}
	
	@PatchMapping("avaliacaoFisicoEspecial/{id}")
	public AvaliacaoFisicoEspecialResponse updateAvaliacaoFisicoEspecial(@PathVariable Long id, @Valid @RequestBody AvaliacaoFisicoEspecialRequest obj) {
		try {
			//AvaliacaoFisicoEspecial o = obj.convertToEntity();
			AvaliacaoFisicoEspecial oldObject = facade.findAvaliacaoFisicoEspecialById(id);

			TypeMap<AvaliacaoFisicoEspecialRequest, AvaliacaoFisicoEspecial> typeMapper = modelMapper
													.typeMap(AvaliacaoFisicoEspecialRequest.class, AvaliacaoFisicoEspecial.class)
													.addMappings(mapper -> mapper.skip(AvaliacaoFisicoEspecial::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new AvaliacaoFisicoEspecialResponse(facade.updateAvaliacaoFisicoEspecial(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("avaliacaoFisicoEspecial/{id}")
	public String deleteAvaliacaoFisicoEspecial(@PathVariable Long id) {
		try {
			facade.deleteAvaliacaoFisicoEspecial(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
