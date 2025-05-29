package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EspecieRequest;
import br.edu.ufape.hvu.controller.dto.response.EspecieResponse;


 
@RestController
@RequestMapping("/api/v1/")
public class EspecieController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@GetMapping("especie")
	public List<EspecieResponse> getAllEspecie() {
		return facade.getAllEspecie()
			.stream()
			.map(EspecieResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("especie")
	public EspecieResponse createEspecie(@Valid @RequestBody EspecieRequest newObj) {
		return new EspecieResponse(facade.saveEspecie(newObj.convertToEntity()));
	}

	@GetMapping("especie/{id}")
	public EspecieResponse getEspecieById(@PathVariable Long id) {
		return new EspecieResponse(facade.findEspecieById(id));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("especie/{id}")
	public EspecieResponse updateEspecie(@PathVariable Long id, @Valid @RequestBody EspecieRequest obj) {
			//Especie o = obj.convertToEntity();
			Especie oldObject = facade.findEspecieById(id);

			TypeMap<EspecieRequest, Especie> typeMapper = modelMapper
													.typeMap(EspecieRequest.class, Especie.class)
													.addMappings(mapper -> mapper.skip(Especie::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new EspecieResponse(facade.updateEspecie(oldObject));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("especie/{id}")
	public String deleteEspecie(@PathVariable Long id) {
		facade.deleteEspecie(id);
		return "";
	}
}
