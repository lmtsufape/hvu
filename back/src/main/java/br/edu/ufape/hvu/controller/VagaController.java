package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.Comparator;
import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.VagaCreateRequest;
import br.edu.ufape.hvu.controller.dto.request.VagaRequest;
import br.edu.ufape.hvu.controller.dto.response.VagaResponse;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class VagaController {
	private final Facade facade;

    @PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO', 'TUTOR')")
	@GetMapping("vaga")
	public List<VagaResponse> getAllVaga() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
	    return facade.findAllVaga(principal.getSubject())
	            .stream()
	            .sorted(Comparator.comparing(Vaga::getDataHora)) // Ordenar as vagas por dataHora
	            .map(VagaResponse::new)
	            .toList();
	}

    @PreAuthorize("hasRole('SECRETARIO')")
    @GetMapping("vaga/especialidade/{idEspecialidade}")
    public List<VagaResponse> getVagasByEspecialidade(@PathVariable(value = "idEspecialidade") long idEspecialidade) {
        return facade.getVagasByEspecialidade(idEspecialidade)
                .stream()
                .map(VagaResponse::new)
                .toList();
    }

    @PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
    @GetMapping("vaga/agendamento/{idAgendamento}")
    public VagaResponse getVagaByAgendamento(@PathVariable(value = "idAgendamento") long idAgendamento) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
        return new VagaResponse(facade.getVagaByAgendamento(idAgendamento, principal.getSubject()));
    }

    @PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
    @GetMapping("vaga/medico/{idMedico}/{data}")
    public List<VagaResponse> getVagasAndAgendamentoByMedico(@PathVariable long idMedico, @PathVariable LocalDate data) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
        return facade.findVagasAndAgendamentoByMedico(data, idMedico, principal.getSubject())
                .stream()
                .map(VagaResponse::new)
                .toList();
    }

    @PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO', 'TUTOR')")
	@GetMapping("vaga/{id}")
	public VagaResponse getVagaById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
        return new VagaResponse(facade.findVagaById(id, principal.getSubject()));
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO', 'TUTOR')")
	@GetMapping("vaga/data/{date}")
	List<VagaResponse> getVagasByDay(@PathVariable LocalDate date) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
		List<Vaga> vagas = facade.findVagasByData(date, principal.getSubject());
		return vagas
				.stream()
				.map(VagaResponse::new)
				.toList();
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO', 'TUTOR')")
	@GetMapping("vaga/data/{dataInicio}/{dataFinal}")
	List<VagaResponse> getVagaBetweenInicialDateAndFinal(@PathVariable LocalDate dataInicio, @PathVariable LocalDate dataFinal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();

		List<Vaga> vagas = facade.findVagaBetweenInicialAndFinalDate(dataInicio, dataFinal, principal.getSubject());
		return vagas.stream()
				.map(VagaResponse::new)
				.toList();
	}

    @PreAuthorize("hasRole('SECRETARIO')")
    @PostMapping("vaga")
    public VagaResponse createVaga(@Valid @RequestBody VagaRequest newObj) {
        return new VagaResponse(facade.saveVaga(newObj.convertToEntity()));
    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @PostMapping("/gestao-vagas/criar")
    public String createNewVagas(@Valid @RequestBody VagaCreateRequest newObj) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
        return facade.createVagasByTurno(newObj, principal.getSubject());
    }

    @PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("vaga/{id}")
	public VagaResponse updateVaga(@PathVariable Long id, @Valid @RequestBody VagaRequest obj) {
		return new VagaResponse(facade.processUpdateVaga(obj, id));
	}

    @PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("vaga/{id}")
	public String deleteVaga(@PathVariable Long id) {
		facade.deleteVaga(id);
		return "";
	}

}
