package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Medicamento;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.MedicamentoRequest;
import br.edu.ufape.hvu.controller.dto.response.MedicamentoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class MedicamentoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("medicamento")
	public List<MedicamentoResponse> getAllMedicamento() {
		return facade.getAllMedicamento()
			.stream()
			.map(MedicamentoResponse::new)
			.toList();
	}
	
	@PostMapping("medicamento")
	public MedicamentoResponse createMedicamento(@Valid @RequestBody MedicamentoRequest newObj) {
		return new MedicamentoResponse(facade.saveMedicamento(newObj.convertToEntity()));
	}
	
	@GetMapping("medicamento/{id}")
	public MedicamentoResponse getMedicamentoById(@PathVariable Long id) {
		try {
			return new MedicamentoResponse(facade.findMedicamentoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("medicamento/{id}")
	public MedicamentoResponse updateMedicamento(@PathVariable Long id, @Valid @RequestBody MedicamentoRequest obj) {
		try {
			//Medicamento o = obj.convertToEntity();
			Medicamento oldObject = facade.findMedicamentoById(id);

			TypeMap<MedicamentoRequest, Medicamento> typeMapper = modelMapper
													.typeMap(MedicamentoRequest.class, Medicamento.class)
													.addMappings(mapper -> mapper.skip(Medicamento::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new MedicamentoResponse(facade.updateMedicamento(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("medicamento/{id}")
	public String deleteMedicamento(@PathVariable Long id) {
		try {
			facade.deleteMedicamento(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
