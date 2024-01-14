package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Orgao;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.OrgaoRequest;
import br.edu.ufape.hvu.controller.dto.response.OrgaoResponse;


@CrossOrigin (origins = "http://localhost:8081/" )
@RestController
@RequestMapping("/api/v1/")
public class OrgaoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("orgao")
	public List<OrgaoResponse> getAllOrgao() {
		return facade.getAllOrgao()
			.stream()
			.map(OrgaoResponse::new)
			.toList();
	}
	
	@PostMapping("orgao")
	public OrgaoResponse createOrgao(@Valid @RequestBody OrgaoRequest newObj) {
		return new OrgaoResponse(facade.saveOrgao(newObj.convertToEntity()));
	}
	
	@GetMapping("orgao/{id}")
	public OrgaoResponse getOrgaoById(@PathVariable Long id) {
		try {
			return new OrgaoResponse(facade.findOrgaoById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orgao " + id + " not found.");
		}
	}
	
	@PatchMapping("orgao/{id}")
	public OrgaoResponse updateOrgao(@PathVariable Long id, @Valid @RequestBody OrgaoRequest obj) {
		try {
			//Orgao o = obj.convertToEntity();
			Orgao oldObject = facade.findOrgaoById(id);

			TypeMap<OrgaoRequest, Orgao> typeMapper = modelMapper
													.typeMap(OrgaoRequest.class, Orgao.class)
													.addMappings(mapper -> mapper.skip(Orgao::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new OrgaoResponse(facade.updateOrgao(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("orgao/{id}")
	public String deleteOrgao(@PathVariable Long id) {
		try {
			facade.deleteOrgao(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
