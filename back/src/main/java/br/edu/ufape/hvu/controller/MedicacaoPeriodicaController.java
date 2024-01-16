package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.MedicacaoPeriodica;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.MedicacaoPeriodicaRequest;
import br.edu.ufape.hvu.controller.dto.response.MedicacaoPeriodicaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class MedicacaoPeriodicaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("medicacaoPeriodica")
	public List<MedicacaoPeriodicaResponse> getAllMedicacaoPeriodica() {
		return facade.getAllMedicacaoPeriodica()
			.stream()
			.map(MedicacaoPeriodicaResponse::new)
			.toList();
	}
	
	@PostMapping("medicacaoPeriodica")
	public MedicacaoPeriodicaResponse createMedicacaoPeriodica(@Valid @RequestBody MedicacaoPeriodicaRequest newObj) {
		return new MedicacaoPeriodicaResponse(facade.saveMedicacaoPeriodica(newObj.convertToEntity()));
	}
	
	@GetMapping("medicacaoPeriodica/{id}")
	public MedicacaoPeriodicaResponse getMedicacaoPeriodicaById(@PathVariable Long id) {
		try {
			return new MedicacaoPeriodicaResponse(facade.findMedicacaoPeriodicaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
		
	}
	
	@PatchMapping("medicacaoPeriodica/{id}")
	public MedicacaoPeriodicaResponse updateMedicacaoPeriodica(@PathVariable Long id, @Valid @RequestBody MedicacaoPeriodicaRequest obj) {
		try {
			//MedicacaoPeriodica o = obj.convertToEntity();
			MedicacaoPeriodica oldObject = facade.findMedicacaoPeriodicaById(id);

			TypeMap<MedicacaoPeriodicaRequest, MedicacaoPeriodica> typeMapper = modelMapper
													.typeMap(MedicacaoPeriodicaRequest.class, MedicacaoPeriodica.class)
													.addMappings(mapper -> mapper.skip(MedicacaoPeriodica::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new MedicacaoPeriodicaResponse(facade.updateMedicacaoPeriodica(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("medicacaoPeriodica/{id}")
	public String deleteMedicacaoPeriodica(@PathVariable Long id) {
		try {
			facade.deleteMedicacaoPeriodica(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
