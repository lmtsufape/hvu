package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.edu.ufape.hvu.controller.dto.request.MedicoRequest;
import br.edu.ufape.hvu.controller.dto.response.MedicoResponse;
import br.edu.ufape.hvu.facade.Facade;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class MedicoController {
	private final Facade facade;

	@PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("medico")
	public List<MedicoResponse> getAllMedico() {
		return facade.getAllMedico()
			.stream()
			.map(MedicoResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("medico")
	public MedicoResponse createMedico(@Valid @RequestBody MedicoRequest newObj) {
        return new MedicoResponse(facade.saveMedico(newObj, newObj.getSenha()));
    }
	
	@GetMapping("medico/{id}")
	public MedicoResponse getMedicoById(@PathVariable Long id) {
		return new MedicoResponse(facade.findMedicoById(id));
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@PatchMapping("medico/{id}")
	public MedicoResponse updateMedico(@PathVariable Long id, @Valid @RequestBody MedicoRequest obj) {
		return new MedicoResponse(facade.updateMedico(id, obj));
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@DeleteMapping("medico/{id}")
	public String deleteMedico(@PathVariable Long id) {
		facade.deleteMedico(id);
		return "";
	}

	@GetMapping("medico/instituicao/{InstituicaoId}")
	public List<MedicoResponse> findByInstituicao(@PathVariable Long InstituicaoId){
		return facade.findByInstituicao(InstituicaoId)
				.stream()
				.map(MedicoResponse::new)
				.toList();
	}

	@GetMapping("medico/especialidade/{EspecialidadeId}")
	public List<MedicoResponse> findByEspecialidade(@PathVariable Long EspecialidadeId){
		return facade.findByEspeciallidade(EspecialidadeId)
				.stream()
				.map(MedicoResponse::new)
				.toList();
	}
}
