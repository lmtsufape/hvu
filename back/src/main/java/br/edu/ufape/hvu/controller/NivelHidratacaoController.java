package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.NivelHidratacao;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.NivelHidratacaoRequest;
import br.edu.ufape.hvu.controller.dto.response.NivelHidratacaoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class NivelHidratacaoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("nivelHidratacao")
	public List<NivelHidratacaoResponse> getAllNivelHidratacao() {
		return facade.getAllNivelHidratacao()
			.stream()
			.map(NivelHidratacaoResponse::new)
			.toList();
	}
	
	@PostMapping("nivelHidratacao")
	public NivelHidratacaoResponse createNivelHidratacao(@Valid @RequestBody NivelHidratacaoRequest newObj) {
		return new NivelHidratacaoResponse(facade.saveNivelHidratacao(newObj.convertToEntity()));
	}
	
	@GetMapping("nivelHidratacao/{id}")
	public NivelHidratacaoResponse getNivelHidratacaoById(@PathVariable Long id) {
		try {
			return new NivelHidratacaoResponse(facade.findNivelHidratacaoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("nivelHidratacao/{id}")
	public NivelHidratacaoResponse updateNivelHidratacao(@PathVariable Long id, @Valid @RequestBody NivelHidratacaoRequest obj) {
		try {
			//NivelHidratacao o = obj.convertToEntity();
			NivelHidratacao oldObject = facade.findNivelHidratacaoById(id);

			TypeMap<NivelHidratacaoRequest, NivelHidratacao> typeMapper = modelMapper
													.typeMap(NivelHidratacaoRequest.class, NivelHidratacao.class)
													.addMappings(mapper -> mapper.skip(NivelHidratacao::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new NivelHidratacaoResponse(facade.updateNivelHidratacao(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("nivelHidratacao/{id}")
	public String deleteNivelHidratacao(@PathVariable Long id) {
		try {
			facade.deleteNivelHidratacao(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
