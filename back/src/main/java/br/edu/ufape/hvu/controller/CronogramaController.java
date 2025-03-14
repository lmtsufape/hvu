package br.edu.ufape.hvu.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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

import br.edu.ufape.hvu.controller.dto.request.CronogramaRequest;
import br.edu.ufape.hvu.controller.dto.response.CronogramaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Cronograma;
import jakarta.validation.Valid;


 
@RestController
@RequestMapping("/api/v1/")
public class CronogramaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@GetMapping("cronograma")
	public List<CronogramaResponse> getAllCronograma() {
		return facade.getAllCronograma()
			.stream()
			.map(CronogramaResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("cronograma")
	public CronogramaResponse createCronograma(@Valid @RequestBody CronogramaRequest newObj) {
		try {
			return new CronogramaResponse(facade.saveCronograma(newObj.convertToEntity()));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@GetMapping("cronograma/{id}")
	public CronogramaResponse getCronogramaById(@PathVariable Long id) {
		try {
			return new CronogramaResponse(facade.findCronogramaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@GetMapping("cronograma/medico/{id}")
	public List<CronogramaResponse> getCronogramaByMedicoId(@PathVariable Long id) {
		try {
			return facade.findCronogramaByMedicoId(id).stream()
					.map(CronogramaResponse::new)
					.toList();
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@GetMapping("cronograma/especialidade/{id}")
	public List<CronogramaResponse> getCronogramaByEspecialidadeId(@PathVariable Long id) {
	
		try {
			return facade.findCronogramaByEspecialidadeId(id).stream()
					.map(CronogramaResponse::new)
					.toList();
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}					
		
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("cronograma/{id}")
	public CronogramaResponse updateCronograma(@PathVariable Long id, @Valid @RequestBody CronogramaRequest obj) {
		try {
			Cronograma oldObject = facade.findCronogramaById(id);

			// medico
			if(obj.getMedico() != null){
				oldObject.setMedico(facade.findMedicoById(obj.getMedico().getId()));
				obj.setMedico(null);
			}

			if (obj.getEspecialidade() != null) {
				oldObject.setEspecialidade(facade.findEspecialidadeById(obj.getEspecialidade().getId()));
				obj.setEspecialidade(null);
			}


			TypeMap<CronogramaRequest, Cronograma> typeMapper = modelMapper
													.typeMap(CronogramaRequest.class, Cronograma.class)
													.addMappings(mapper -> mapper.skip(Cronograma::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new CronogramaResponse(facade.updateCronograma(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("cronograma/{id}")
	public String deleteCronograma(@PathVariable Long id) {
		try {
			facade.deleteCronograma(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
		}
		
	}
}
