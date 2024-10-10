package br.edu.ufape.hvu.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ufape.hvu.controller.dto.request.MedicoRequest;
import br.edu.ufape.hvu.controller.dto.response.MedicoResponse;
import br.edu.ufape.hvu.exception.DuplicateAccountException;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Medico;
import jakarta.validation.Valid;


 
@RestController
@RequestMapping("/api/v1/")
public class MedicoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("medico")
	public List<MedicoResponse> getAllMedico() {
		return facade.getAllMedico()
			.stream()
			.map(MedicoResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@PostMapping("medico")
	public MedicoResponse createMedico(@Valid @RequestBody MedicoRequest newObj) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			facade.findDuplicateAccountByuserId(principal.getSubject());
			Medico o = newObj.convertToEntity();
			o.setUserId(principal.getSubject());
			return new MedicoResponse(facade.saveMedico(o));
		} catch(DuplicateAccountException ex){
			throw ex;
		}
		
	}

	@GetMapping("medico/{id}")
	public MedicoResponse getMedicoById(@PathVariable Long id) {
		try {
			return new MedicoResponse(facade.findMedicoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@PatchMapping("medico/{id}")
	public MedicoResponse updateMedico(@PathVariable Long id, @Valid @RequestBody MedicoRequest obj) {
		try {
			Medico o = obj.convertToEntity();
			Medico oldObject = facade.findMedicoById(id);

			// instituicao
			if (obj.getInstituicao() != null) {
				oldObject.setInstituicao(facade.findInstituicaoById(obj.getInstituicao().getId()));
				obj.setInstituicao(null);
			}
		
			TypeMap<Medico, Medico> typeMapper = modelMapper
													.typeMap(Medico.class, Medico.class)
													.addMappings(mapper -> mapper.skip(Medico::setId));			
			
			
			typeMapper.map(o, oldObject);	
			return new MedicoResponse(facade.updateMedico(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@DeleteMapping("medico/{id}")
	public String deleteMedico(@PathVariable Long id) {
		try {
			Medico oldObject = facade.findMedicoById(id);
			facade.deleteMedico(oldObject);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
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
