package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.Orgao;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.OrgaoRequest;
import br.edu.ufape.hvu.controller.dto.response.OrgaoResponse;
 
@RestController
@RequestMapping("/api/v1/")
public class OrgaoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("orgao")
	public List<OrgaoResponse> getAllOrgao() {
		return facade.getAllOrgao()
			.stream()
			.map(OrgaoResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PostMapping("orgao")
	public OrgaoResponse createOrgao(@Valid @RequestBody OrgaoRequest newObj) {
		return new OrgaoResponse(facade.saveOrgao(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("orgao/{id}")
	public OrgaoResponse getOrgaoById(@PathVariable Long id) {
		return new OrgaoResponse(facade.findOrgaoById(id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("orgao/{id}")
	public OrgaoResponse updateOrgao(@PathVariable Long id, @Valid @RequestBody OrgaoRequest obj) {
			//Orgao o = obj.convertToEntity();
			Orgao oldObject = facade.findOrgaoById(id);


			TypeMap<OrgaoRequest, Orgao> typeMapper = modelMapper
													.typeMap(OrgaoRequest.class, Orgao.class)
													.addMappings(mapper -> mapper.skip(Orgao::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new OrgaoResponse(facade.updateOrgao(oldObject));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("orgao/{id}")
	public String deleteOrgao(@PathVariable Long id) {
		facade.deleteOrgao(id);
		return "";
	}
	

}
