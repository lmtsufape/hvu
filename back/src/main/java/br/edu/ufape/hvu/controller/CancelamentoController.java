package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.edu.ufape.hvu.controller.dto.request.CancelamentoRequest;
import br.edu.ufape.hvu.controller.dto.response.CancelamentoResponse;
import br.edu.ufape.hvu.facade.Facade;
import jakarta.validation.Valid;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class CancelamentoController {
	private final Facade facade;

    @PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("cancelamento")
	public List<CancelamentoResponse> getAllCancelamento() {
		return facade.getAllCancelamento()
			.stream()
			.map(CancelamentoResponse::new)
			.toList();
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', 'TUTOR')")
	@PostMapping("cancelamento/agendamento")
	public CancelamentoResponse createCancelamentoAgendamento(@Valid @RequestBody CancelamentoRequest newObj) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();

		return new CancelamentoResponse(facade.cancelarAgendamento(newObj.convertToEntity(), principal.getSubject()));
	}

    @PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("cancelamento/vaga")
	public CancelamentoResponse createCancelamentoVaga(@Valid @RequestBody CancelamentoRequest newObj) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
		return new CancelamentoResponse(facade.cancelarVaga(newObj.convertToEntity(), principal.getSubject()));
	}

    @PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("cancelamento/{id}")
	public CancelamentoResponse getCancelamentoById(@PathVariable Long id) {
		return new CancelamentoResponse(facade.findCancelamentoById(id));
	}

    @PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("cancelamento/tutor/{id}")
	public List<CancelamentoResponse> getCancelamentosByTutorId(@PathVariable Long id) {
		return facade.findCancelamentoByTutorId(id)
					.stream()
					.map(CancelamentoResponse::new)
					.toList();
	}

    @PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("cancelamento/{id}")
	public CancelamentoResponse updateCancelamento(@PathVariable Long id, @Valid @RequestBody CancelamentoRequest obj) {
		return new CancelamentoResponse(facade.updateCancelamento(id, obj));
	}

    @PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("cancelamento/{id}")
	public String deleteCancelamento(@PathVariable Long id) {
		facade.deleteCancelamento(id);
		return "";
	}

}
