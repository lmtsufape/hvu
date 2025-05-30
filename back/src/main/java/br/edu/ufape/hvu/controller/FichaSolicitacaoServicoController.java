package br.edu.ufape.hvu.controller;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.model.FichaSolicitacaoServico;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.FichaSolicitacaoServicoRequest;
import br.edu.ufape.hvu.controller.dto.response.FichaSolicitacaoServicoResponse;


 
@RestController
@RequestMapping("/api/v1/")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class FichaSolicitacaoServicoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("fichaSolicitacaoServico")
	public List<FichaSolicitacaoServicoResponse> getAllFichaSolicitacaoServico() {
		return facade.getAllFichaSolicitacaoServico()
			.stream()
			.map(FichaSolicitacaoServicoResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PostMapping("fichaSolicitacaoServico")
	public FichaSolicitacaoServicoResponse createFichaSolicitacaoServico(@Valid @RequestBody FichaSolicitacaoServicoRequest newObj) {
		FichaSolicitacaoServico fichaSolicitacaoServico = newObj.convertToEntity();
		fichaSolicitacaoServico.gerarCodigoPatologia();
		FichaSolicitacaoServico savedFicha = facade.saveFichaSolicitacaoServico(fichaSolicitacaoServico);
		return new FichaSolicitacaoServicoResponse(savedFicha);
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("fichaSolicitacaoServico/{id}")
	public FichaSolicitacaoServicoResponse getFichaSolicitacaoServicoById(@PathVariable Long id) {
		return new FichaSolicitacaoServicoResponse(facade.findFichaSolicitacaoServicoById(id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("fichaSolicitacaoServico/{id}")
	public FichaSolicitacaoServicoResponse updateFichaSolicitacaoServico(@PathVariable Long id, @Valid @RequestBody FichaSolicitacaoServicoRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new FichaSolicitacaoServicoResponse(facade.updateFichaSolicitacaoServico(obj, id, principal.getSubject()));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("fichaSolicitacaoServico/{id}")
	public String deleteFichaSolicitacaoServico(@PathVariable Long id) {
		facade.deleteFichaSolicitacaoServico(id);
		return "";
	}
	

}
