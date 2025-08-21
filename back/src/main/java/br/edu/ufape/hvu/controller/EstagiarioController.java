package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EstagiarioRequest;
import br.edu.ufape.hvu.controller.dto.response.EstagiarioResponse;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class EstagiarioController {
	private final Facade facade;

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("estagiario")
	public List<EstagiarioResponse> getAllEstagiario() {
		return facade.getAllEstagiario()
			.stream()
			.map(EstagiarioResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PostMapping("estagiario")
	public EstagiarioResponse createEstagiario(@Valid @RequestBody EstagiarioRequest newObj) {
		return new EstagiarioResponse(facade.saveEstagiario(newObj.convertToEntity()));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("estagiario/{id}")
	public EstagiarioResponse getEstagiarioById(@PathVariable Long id) {
		return new EstagiarioResponse(facade.findEstagiarioById(id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PatchMapping("estagiario/{id}")
	public EstagiarioResponse updateEstagiario(@PathVariable Long id, @Valid @RequestBody EstagiarioRequest obj) {
		return new EstagiarioResponse(facade.updateEstagiario(obj, id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@DeleteMapping("estagiario/{id}")
	public String deleteEstagiario(@PathVariable Long id) {
		facade.deleteEstagiario(id);
		return "";
	}
	

}
