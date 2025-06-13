package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EspecialidadeRequest;
import br.edu.ufape.hvu.controller.dto.response.EspecialidadeResponse;

 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class EspecialidadeController {
	private final Facade facade;

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
		return new EspecialidadeResponse(facade.updateEspecialidade(obj, id));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("especialidade/{id}")
	public String deleteEspecialidade(@PathVariable Long id) {
		facade.deleteEspecialidade(id);
		return "";
	}
	

}
