package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.model.Consulta;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.ConsultaRequest;
import br.edu.ufape.hvu.controller.dto.request.ConsultaRequestFix;
import br.edu.ufape.hvu.controller.dto.response.ConsultaResponse;
import br.edu.ufape.hvu.controller.dto.response.ConsultaResponseFix;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class ConsultaController {
	private final Facade facade;

    @PreAuthorize("hasRole('MEDICO')")
	@GetMapping("consulta")
	public List<ConsultaResponse> getAllConsulta() {
		return facade.getAllConsulta()
			.stream()
			.map(ConsultaResponse::new)
			.toList();
	}

    @PreAuthorize("hasRole('MEDICO')")
	@PostMapping("consulta/{id}")
	public ConsultaResponseFix createConsulta(@PathVariable Long id, @Valid @RequestBody ConsultaRequestFix consultaRequest) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		return facade.saveConsulta(id, consultaRequest, principal.getSubject());
	}

    @PreAuthorize("hasRole('MEDICO')")
	@GetMapping("consulta/{id}")
	public ConsultaResponse getConsultaById(@PathVariable Long id) {
		return new ConsultaResponse(facade.findConsultaById(id));
	}

    @PreAuthorize("hasRole('MEDICO')")
	@GetMapping("consulta/animalid/{id}")
	public List<ConsultaResponse> getConsultaByAnimalId(@PathVariable Long id){
		List<Consulta> consultas = facade.getConsultaByAnimalId(id);
		return consultas.stream()
				.map(ConsultaResponse::new)
				.toList();
	}

    @PreAuthorize("hasRole('MEDICO')")
	@PatchMapping("consulta/{id}")
	public ConsultaResponse updateConsulta(@PathVariable Long id, @Valid @RequestBody ConsultaRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		return new ConsultaResponse(facade.updateConsulta(obj, id, principal.getSubject()));
	}

    @PreAuthorize("hasRole('MEDICO')")
	@DeleteMapping("consulta/{id}")
	public String deleteConsulta(@PathVariable Long id) {
		facade.deleteConsulta(id);
		return "";
	}

}
