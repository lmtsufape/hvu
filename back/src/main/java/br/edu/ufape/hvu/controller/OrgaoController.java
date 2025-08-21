package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.OrgaoRequest;
import br.edu.ufape.hvu.controller.dto.response.OrgaoResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class OrgaoController {
	private final Facade facade;

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("orgao")
	public List<OrgaoResponse> getAllOrgao() {
		return facade.getAllOrgao()
			.stream()
			.map(OrgaoResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PostMapping("orgao")
	public OrgaoResponse createOrgao(@Valid @RequestBody OrgaoRequest newObj) {
		return new OrgaoResponse(facade.saveOrgao(newObj.convertToEntity()));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("orgao/{id}")
	public OrgaoResponse getOrgaoById(@PathVariable Long id) {
		return new OrgaoResponse(facade.findOrgaoById(id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PatchMapping("orgao/{id}")
	public OrgaoResponse updateOrgao(@PathVariable Long id, @Valid @RequestBody OrgaoRequest obj) {
		return new OrgaoResponse(facade.updateOrgao(obj, id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@DeleteMapping("orgao/{id}")
	public String deleteOrgao(@PathVariable Long id) {
		facade.deleteOrgao(id);
		return "";
	}
	

}
