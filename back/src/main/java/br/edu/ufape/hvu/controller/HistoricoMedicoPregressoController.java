package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.HistoricoMedicoPregresso;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.HistoricoMedicoPregressoRequest;
import br.edu.ufape.hvu.controller.dto.response.HistoricoMedicoPregressoResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class HistoricoMedicoPregressoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("historicoMedicoPregresso")
	public List<HistoricoMedicoPregressoResponse> getAllHistoricoMedicoPregresso() {
		return facade.getAllHistoricoMedicoPregresso()
			.stream()
			.map(HistoricoMedicoPregressoResponse::new)
			.toList();
	}
	
	@PostMapping("historicoMedicoPregresso")
	public HistoricoMedicoPregressoResponse createHistoricoMedicoPregresso(@Valid @RequestBody HistoricoMedicoPregressoRequest newObj) {
		return new HistoricoMedicoPregressoResponse(facade.saveHistoricoMedicoPregresso(newObj.convertToEntity()));
	}
	
	@GetMapping("historicoMedicoPregresso/{id}")
	public HistoricoMedicoPregressoResponse getHistoricoMedicoPregressoById(@PathVariable Long id) {
		return new HistoricoMedicoPregressoResponse(facade.findHistoricoMedicoPregressoById(id));
	}
	
	@PatchMapping("historicoMedicoPregresso/{id}")
	public HistoricoMedicoPregressoResponse updateHistoricoMedicoPregresso(@PathVariable Long id, @Valid @RequestBody HistoricoMedicoPregressoRequest obj) {
		try {
			//HistoricoMedicoPregresso o = obj.convertToEntity();
			HistoricoMedicoPregresso oldObject = facade.findHistoricoMedicoPregressoById(id);

			TypeMap<HistoricoMedicoPregressoRequest, HistoricoMedicoPregresso> typeMapper = modelMapper
													.typeMap(HistoricoMedicoPregressoRequest.class, HistoricoMedicoPregresso.class)
													.addMappings(mapper -> mapper.skip(HistoricoMedicoPregresso::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new HistoricoMedicoPregressoResponse(facade.updateHistoricoMedicoPregresso(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("historicoMedicoPregresso/{id}")
	public String deleteHistoricoMedicoPregresso(@PathVariable Long id) {
		try {
			facade.deleteHistoricoMedicoPregresso(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
