package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EspecieRequest;
import br.edu.ufape.hvu.controller.dto.response.EspecieResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class EspecieController {
	private final Facade facade;

	@GetMapping("especie")
	public List<EspecieResponse> getAllEspecie() {
		return facade.getAllEspecie()
			.stream()
			.map(EspecieResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', PATOLOGISTA)")
	@PostMapping("especie")
	public EspecieResponse createEspecie(@Valid @RequestBody EspecieRequest newObj) {
		return new EspecieResponse(facade.saveEspecie(newObj.convertToEntity()));
	}

	@GetMapping("especie/{id}")
	public EspecieResponse getEspecieById(@PathVariable Long id) {
		return new EspecieResponse(facade.findEspecieById(id));
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', PATOLOGISTA)")
	@PatchMapping("especie/{id}")
	public EspecieResponse updateEspecie(@PathVariable Long id, @Valid @RequestBody EspecieRequest obj) {
		return new EspecieResponse(facade.updateEspecie(obj, id));
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', PATOLOGISTA)")
	@DeleteMapping("especie/{id}")
	public String deleteEspecie(@PathVariable Long id) {
		facade.deleteEspecie(id);
		return "";
	}

}
