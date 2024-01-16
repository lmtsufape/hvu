package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.MedicoRequest;
import br.edu.ufape.hvu.controller.dto.response.MedicoResponse;
import br.edu.ufape.hvu.exception.DuplicateAccountException;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class MedicoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("medico")
	public List<MedicoResponse> getAllMedico() {
		return facade.getAllMedico()
			.stream()
			.map(MedicoResponse::new)
			.toList();
	}
	
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
	
	@PatchMapping("medico/{id}")
	public MedicoResponse updateMedico(@PathVariable Long id, @Valid @RequestBody MedicoRequest obj) {
		try {
			//Medico o = obj.convertToEntity();
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			
			Medico o = obj.convertToEntity();
			Medico oldObject = facade.findMedicoById(id);
			
			if(!principal.getSubject().equals(oldObject.getUserId())) {
				throw new AccessDeniedException("This is not your account");
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
	
	@DeleteMapping("medico/{id}")
	public String deleteMedico(@PathVariable Long id) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			
			Medico oldObject = facade.findMedicoById(id);
			
			if(!principal.getSubject().equals(oldObject.getUserId())) {
				throw new AccessDeniedException("This is not your account");
			}
			facade.deleteMedico(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
