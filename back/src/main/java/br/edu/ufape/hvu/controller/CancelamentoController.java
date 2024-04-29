package br.edu.ufape.hvu.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import br.edu.ufape.hvu.controller.dto.request.CancelamentoRequest;
import br.edu.ufape.hvu.controller.dto.response.CancelamentoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Cancelamento;
import jakarta.validation.Valid;

@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class CancelamentoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("cancelamento")
	public List<CancelamentoResponse> getAllCancelamento() {
		return facade.getAllCancelamento()
			.stream()
			.map(CancelamentoResponse::new)
			.toList();
	}
	
	@PostMapping("cancelamento")
	public CancelamentoResponse createCancelamento(@Valid @RequestBody CancelamentoRequest newObj) {
		return new CancelamentoResponse(facade.saveCancelamento(newObj.convertToEntity()));
	}
	
	@GetMapping("cancelamento/{id}")
	public CancelamentoResponse getCancelamentoById(@PathVariable Long id) {
		try {
			return new CancelamentoResponse(facade.findCancelamentoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("cancelamento/{id}")
	public CancelamentoResponse updateCancelamento(@PathVariable Long id, @Valid @RequestBody CancelamentoRequest obj) {
		try {
			//Cancelamento o = obj.convertToEntity();
			Cancelamento oldObject = facade.findCancelamentoById(id);

			if (obj.getAgendamento() != null) {
				oldObject.setAgendamento(obj.getAgendamento().convertToEntity());
				obj.setAgendamento(null);
			}

			if (obj.getEspecialidade() != null) {
				oldObject.setEspecialidade(obj.getEspecialidade().convertToEntity());
				obj.setEspecialidade(null);
			}

			TypeMap<CancelamentoRequest, Cancelamento> typeMapper = modelMapper
													.typeMap(CancelamentoRequest.class, Cancelamento.class)
													.addMappings(mapper -> mapper.skip(Cancelamento::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new CancelamentoResponse(facade.updateCancelamento(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("cancelamento/{id}")
	public String deleteCancelamento(@PathVariable Long id) {
		try {
			facade.deleteCancelamento(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}

