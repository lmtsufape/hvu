package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.MaterialColetadoRequest;
import br.edu.ufape.hvu.controller.dto.response.MaterialColetadoResponse;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class MaterialColetadoController {
	private final Facade facade;

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("materialColetado")
	public List<MaterialColetadoResponse> getAllMaterialColetado() {
		return facade.getAllMaterialColetado()
			.stream()
			.map(MaterialColetadoResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PostMapping("materialColetado")
	public MaterialColetadoResponse createMaterialColetado(@Valid @RequestBody MaterialColetadoRequest newObj) {
		return new MaterialColetadoResponse(facade.saveMaterialColetado(newObj.convertToEntity()));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("materialColetado/{id}")
	public MaterialColetadoResponse getMaterialColetadoById(@PathVariable Long id) {
		return new MaterialColetadoResponse(facade.findMaterialColetadoById(id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PatchMapping("materialColetado/{id}")
	public MaterialColetadoResponse updateMaterialColetado(@PathVariable Long id, @Valid @RequestBody MaterialColetadoRequest obj) {
			return new MaterialColetadoResponse(facade.updateMaterialColetado(obj, id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@DeleteMapping("materialColetado/{id}")
	public String deleteMaterialColetado(@PathVariable Long id) {
		facade.deleteMaterialColetado(id);
		return "";
	}
}
