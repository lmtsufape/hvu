package br.edu.ufape.hvu.controller;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.AgendamentoEspecialRequest;
import br.edu.ufape.hvu.controller.dto.request.AgendamentoRequest;
import br.edu.ufape.hvu.controller.dto.response.AgendamentoResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class AgendamentoController {
	private final Facade facade;

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@GetMapping("agendamento")
	public List<AgendamentoResponse> getAllAgendamento() {
		return facade.getAllAgendamento()
			.stream()
			.map(AgendamentoResponse::new)
			.toList();
	}

	// Listar agendamentos por ordem de horário
	@GetMapping("agendamento/ordemdehorario")
	public List<AgendamentoResponse> getAllAgendamentosOrdemDehorario() {
		return facade.getAllAgendamento().stream()
				.map(AgendamentoResponse::new)
				.sorted(Comparator.comparing(AgendamentoResponse::getDataVaga).reversed()).toList();
	}

	@PostMapping("agendamento/vaga/{idVaga}")
	public AgendamentoResponse createAgendamento(@Valid @RequestBody AgendamentoRequest newObj, @PathVariable Long idVaga) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new AgendamentoResponse(facade.saveAgendamento(newObj, idVaga, principal.getSubject()));
	}
	
	@PostMapping("agendamento/especial")
	public AgendamentoResponse createAgendamentoEspecial(@Valid @RequestBody AgendamentoEspecialRequest newObj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new AgendamentoResponse(facade.createAgendamentoEspecial(newObj, principal.getSubject()));
	}


	@GetMapping("agendamento/{id}")
	public AgendamentoResponse getAgendamentoById(@PathVariable Long id) {
		return new AgendamentoResponse(facade.findAgendamentoById(id));
	}
	
	@GetMapping("agendamento/medico/{id}")
	public List<AgendamentoResponse> getAgendamentosByMedicoId(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		return facade.findAgendamentosByMedicoId(id,principal.getSubject())
				.stream()
				.map(AgendamentoResponse::new)
				.toList();
	}

	@GetMapping("agendamento/tutor")
	public List<AgendamentoResponse> findAgendamentosByTutorId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
			
		return facade.findAgendamentosByTutorId(principal.getSubject())
				.stream()
				.map(AgendamentoResponse::new)
				.toList();
	}

	@GetMapping("agendamento/datasnaopodeagendar/{tutorId}")
	public List<LocalDateTime> retornaDatasQueTutorNaoPodeAgendar(@PathVariable String tutorId){
	return facade.retornaVagaQueTutorNaoPodeAgendar(tutorId);
	}

	@PatchMapping("agendamento/reagendamento/{idAgendamento}/{idVaga}")
	public Agendamento reagendarAgendamento(@PathVariable Long idAgendamento, @PathVariable Long idVaga) {
		return facade.reagendarAgendamento(idAgendamento,idVaga);
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@PatchMapping("agendamento/{id}")
	public AgendamentoResponse updateAgendamento(@PathVariable Long id, @Valid @RequestBody AgendamentoRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new AgendamentoResponse(facade.processUpdateAgendamento(obj, id, principal.getSubject()));
	}
	
	@DeleteMapping("agendamento/{id}")
	public String deleteAgendamento(@PathVariable Long id) {
		facade.deleteAgendamento(id);
		return "";
	}

}
