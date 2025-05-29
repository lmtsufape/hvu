package br.edu.ufape.hvu.controller;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import java.time.LocalDate;
import java.util.Comparator;
import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.VagaCreateRequest;
import br.edu.ufape.hvu.controller.dto.request.VagaRequest;
import br.edu.ufape.hvu.controller.dto.response.VagaResponse;

@RestController
@RequestMapping("/api/v1/")
public class VagaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("vaga")
	public List<VagaResponse> getAllVaga() {
	    return facade.getAllVaga()
	            .stream()
	            .sorted(Comparator.comparing(Vaga::getDataHora)) // Ordenar as vagas por dataHora
	            .map(VagaResponse::new)
	            .toList();
	}
	
	@PostMapping("vaga")
	public VagaResponse createVaga(@Valid @RequestBody VagaRequest newObj) {
		return new VagaResponse(facade.saveVaga(newObj.convertToEntity()));
	}
	
	@GetMapping("vaga/{id}")
	public VagaResponse getVagaById(@PathVariable Long id) {
		return new VagaResponse(facade.findVagaById(id));
	}

	@GetMapping("vaga/data/{date}")
	List<VagaResponse> getVagasByDay(@PathVariable LocalDate date){
		List<Vaga> vagas = facade.findVagaByData(date);
		return vagas
				.stream()
				.map(VagaResponse::new)
				.toList();
	}

	@GetMapping("vaga/data/{dataInicio}/{dataFinal}")
	List<VagaResponse> getVagaBetweenInicialDateAndFinal(@PathVariable LocalDate dataInicio, @PathVariable LocalDate dataFinal){
		List<Vaga> vagas = facade.findVagaBetweenInicialAndFinalDate(dataInicio, dataFinal);
		return vagas
				.stream()
				.map(VagaResponse::new)
				.toList();
	}
	
	@PatchMapping("vaga/{id}")
	public VagaResponse updateVaga(@PathVariable Long id, @Valid @RequestBody VagaRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new VagaResponse(facade.processUpdateAgendamento(obj, id, principal.getSubject()));
	}
	
	@PostMapping("/gestao-vagas/criar")
	public String createNewVagas(@Valid @RequestBody VagaCreateRequest newObj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return facade.createVagasByTurno(newObj, principal.getSubject());
	}
	
	
	@DeleteMapping("vaga/{id}")
	public String deleteVaga(@PathVariable Long id) {
		facade.deleteVaga(id);
		return "";
	}
	
	@GetMapping("vaga/especialidade/{idEspecialidade}")
	public List<VagaResponse> getVagasByEspecialidade(@PathVariable(value = "idEspecialidade") long idEspecialidade) {
		return facade.getVagasByEspecialidade(idEspecialidade)
				.stream()
				.map(VagaResponse::new)
				.toList();
	}
	
	@GetMapping("vaga/medico/{idMedico}/{data}")
	public List<VagaResponse> findVagasAndAgendamentoByMedico(@PathVariable long idMedico, @PathVariable LocalDate data) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return facade.findVagasAndAgendamentoByMedico(data, idMedico, principal.getSubject())
				.stream()
				.map(VagaResponse::new)
				.toList();
	}
	
	@GetMapping("vaga/agendamento/{idAgendamento}")
	public VagaResponse getVagaByAgendamento(@PathVariable(value = "idAgendamento") long idAgendamento) {
		return new VagaResponse(facade.getVagaByAgendamento(idAgendamento));
	}
}
