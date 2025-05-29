package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.Estagiario;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EstagiarioRequest;
import br.edu.ufape.hvu.controller.dto.response.EstagiarioResponse;

@RestController
@RequestMapping("/api/v1/")
public class EstagiarioController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("estagiario")
	public List<EstagiarioResponse> getAllEstagiario() {
		return facade.getAllEstagiario()
			.stream()
			.map(EstagiarioResponse::new)
			.toList();
	}
	
	@PostMapping("estagiario")
	public EstagiarioResponse createEstagiario(@Valid @RequestBody EstagiarioRequest newObj) {
		return new EstagiarioResponse(facade.saveEstagiario(newObj.convertToEntity()));
	}
	
	@GetMapping("estagiario/{id}")
	public EstagiarioResponse getEstagiarioById(@PathVariable Long id) {
		return new EstagiarioResponse(facade.findEstagiarioById(id));
	}
	
	@PatchMapping("estagiario/{id}")
	public EstagiarioResponse updateEstagiario(@PathVariable Long id, @Valid @RequestBody EstagiarioRequest obj) {
			//Estagiario o = obj.convertToEntity();
			Estagiario oldObject = facade.findEstagiarioById(id);

			TypeMap<EstagiarioRequest, Estagiario> typeMapper = modelMapper
													.typeMap(EstagiarioRequest.class, Estagiario.class)
													.addMappings(mapper -> mapper.skip(Estagiario::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new EstagiarioResponse(facade.updateEstagiario(oldObject));
	}
	
	@DeleteMapping("estagiario/{id}")
	public String deleteEstagiario(@PathVariable Long id) {
		facade.deleteEstagiario(id);
		return "";
	}
	

}
