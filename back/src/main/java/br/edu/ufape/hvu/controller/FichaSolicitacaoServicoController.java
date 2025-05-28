package br.edu.ufape.hvu.controller;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.FichaSolicitacaoServico;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.FichaSolicitacaoServicoRequest;
import br.edu.ufape.hvu.controller.dto.response.FichaSolicitacaoServicoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
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
		try {
			return new FichaSolicitacaoServicoResponse(facade.findFichaSolicitacaoServicoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("fichaSolicitacaoServico/{id}")
	public FichaSolicitacaoServicoResponse updateFichaSolicitacaoServico(@PathVariable Long id, @Valid @RequestBody FichaSolicitacaoServicoRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		try {
			//FichaSolicitacaoServico o = obj.convertToEntity();
			FichaSolicitacaoServico oldObject = facade.findFichaSolicitacaoServicoById(id);

			if(obj.getMedico() != null){
				oldObject.setMedico(facade.findMedicoById(obj.getMedico().getId(), principal.getSubject()));
				obj.setMedico(null);
			}


			TypeMap<FichaSolicitacaoServicoRequest, FichaSolicitacaoServico> typeMapper = modelMapper
													.typeMap(FichaSolicitacaoServicoRequest.class, FichaSolicitacaoServico.class)
													.addMappings(mapper -> mapper.skip(FichaSolicitacaoServico::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new FichaSolicitacaoServicoResponse(facade.updateFichaSolicitacaoServico(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("fichaSolicitacaoServico/{id}")
	public String deleteFichaSolicitacaoServico(@PathVariable Long id) {
		try {
			facade.deleteFichaSolicitacaoServico(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
