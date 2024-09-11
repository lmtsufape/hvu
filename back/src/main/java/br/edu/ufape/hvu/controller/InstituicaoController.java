package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Instituicao;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.InstituicaoRequest;
import br.edu.ufape.hvu.controller.dto.response.InstituicaoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class InstituicaoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("instituicao")
	public List<InstituicaoResponse> getAllInstituicao() {
		return facade.getAllInstituicao()
			.stream()
			.map(InstituicaoResponse::new)
			.toList();
	}
	
	@PostMapping("instituicao")
	public InstituicaoResponse createInstituicao(@Valid @RequestBody InstituicaoRequest newObj) {
		return new InstituicaoResponse(facade.saveInstituicao(newObj.convertToEntity()));
	}
	
	@GetMapping("instituicao/{id}")
	public InstituicaoResponse getInstituicaoById(@PathVariable Long id) {
		try {
			return new InstituicaoResponse(facade.findInstituicaoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("instituicao/{id}")
	public InstituicaoResponse updateInstituicao(@PathVariable Long id, @Valid @RequestBody InstituicaoRequest obj) {
		try {
			//Instituicao o = obj.convertToEntity();
			Instituicao oldObject = facade.findInstituicaoById(id);

			TypeMap<InstituicaoRequest, Instituicao> typeMapper = modelMapper
													.typeMap(InstituicaoRequest.class, Instituicao.class)
													.addMappings(mapper -> mapper.skip(Instituicao::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new InstituicaoResponse(facade.updateInstituicao(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("instituicao/{id}")
	public String deleteInstituicao(@PathVariable Long id) {
		try {
			facade.deleteInstituicao(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
