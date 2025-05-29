package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EspecialidadeRequest;
import br.edu.ufape.hvu.controller.dto.response.EspecialidadeResponse;

 
@RestController
@RequestMapping("/api/v1/")
public class EspecialidadeController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('SECRETARIO','MEDICO')")
	@GetMapping("especialidade")
	public List<EspecialidadeResponse> getAllEspecialidade() {
		return facade.getAllEspecialidade()
			.stream()
			.map(EspecialidadeResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("especialidade")
	public EspecialidadeResponse createEspecialidade(@Valid @RequestBody EspecialidadeRequest newObj) {
		return new EspecialidadeResponse(facade.saveEspecialidade(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('SECRETARIO','MEDICO' )")
	@GetMapping("especialidade/{id}")
	public EspecialidadeResponse getEspecialidadeById(@PathVariable Long id) {
		return new EspecialidadeResponse(facade.findEspecialidadeById(id));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("especialidade/{id}")
	public EspecialidadeResponse updateEspecialidade(@PathVariable Long id, @Valid @RequestBody EspecialidadeRequest obj) {
		//Especialidade o = obj.convertToEntity();
		Especialidade oldObject = facade.findEspecialidadeById(id);

		TypeMap<EspecialidadeRequest, Especialidade> typeMapper = modelMapper
													.typeMap(EspecialidadeRequest.class, Especialidade.class)
													.addMappings(mapper -> mapper.skip(Especialidade::setId));			
			
			
		typeMapper.map(obj, oldObject);
		return new EspecialidadeResponse(facade.updateEspecialidade(oldObject));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("especialidade/{id}")
	public String deleteEspecialidade(@PathVariable Long id) {
		facade.deleteEspecialidade(id);
		return "";
	}
	

}
