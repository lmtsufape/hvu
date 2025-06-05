package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.InstituicaoRequest;
import br.edu.ufape.hvu.controller.dto.response.InstituicaoResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class InstituicaoController {
	private final Facade facade;

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("instituicao")
	public List<InstituicaoResponse> getAllInstituicao() {
		return facade.getAllInstituicao()
			.stream()
			.map(InstituicaoResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PostMapping("instituicao")
	public InstituicaoResponse createInstituicao(@Valid @RequestBody InstituicaoRequest newObj) {
		return new InstituicaoResponse(facade.saveInstituicao(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("instituicao/{id}")
	public InstituicaoResponse getInstituicaoById(@PathVariable Long id) {
		return new InstituicaoResponse(facade.findInstituicaoById(id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("instituicao/{id}")
	public InstituicaoResponse updateInstituicao(@PathVariable Long id, @Valid @RequestBody InstituicaoRequest obj) {
		return new InstituicaoResponse(facade.updateInstituicao(obj, id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("instituicao/{id}")
	public String deleteInstituicao(@PathVariable Long id) {
		facade.deleteInstituicao(id);
		return "";
	}
	

}
