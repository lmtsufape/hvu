package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.ExameMicroscopico;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.ExameMicroscopicoRequest;
import br.edu.ufape.hvu.controller.dto.response.ExameMicroscopicoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:8081/" )
@RestController
@RequestMapping("/api/v1/")
public class ExameMicroscopicoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("exameMicroscopico")
	public List<ExameMicroscopicoResponse> getAllExameMicroscopico() {
		return facade.getAllExameMicroscopico()
			.stream()
			.map(ExameMicroscopicoResponse::new)
			.toList();
	}
	
	@PostMapping("exameMicroscopico")
	public ExameMicroscopicoResponse createExameMicroscopico(@Valid @RequestBody ExameMicroscopicoRequest newObj) {
		return new ExameMicroscopicoResponse(facade.saveExameMicroscopico(newObj.convertToEntity()));
	}
	
	@GetMapping("exameMicroscopico/{id}")
	public ExameMicroscopicoResponse getExameMicroscopicoById(@PathVariable Long id) {
		try {
			return new ExameMicroscopicoResponse(facade.findExameMicroscopicoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("exameMicroscopico/{id}")
	public ExameMicroscopicoResponse updateExameMicroscopico(@PathVariable Long id, @Valid @RequestBody ExameMicroscopicoRequest obj) {
		try {
			//ExameMicroscopico o = obj.convertToEntity();
			ExameMicroscopico oldObject = facade.findExameMicroscopicoById(id);

			TypeMap<ExameMicroscopicoRequest, ExameMicroscopico> typeMapper = modelMapper
													.typeMap(ExameMicroscopicoRequest.class, ExameMicroscopico.class)
													.addMappings(mapper -> mapper.skip(ExameMicroscopico::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new ExameMicroscopicoResponse(facade.updateExameMicroscopico(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("exameMicroscopico/{id}")
	public String deleteExameMicroscopico(@PathVariable Long id) {
		try {
			facade.deleteExameMicroscopico(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
