package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EnderecoRequest;
import br.edu.ufape.hvu.controller.dto.response.EnderecoResponse;

 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class EnderecoController {
	private final Facade facade;

	@GetMapping("endereco")
	public List<EnderecoResponse> getAllEndereco() {
		return facade.getAllEndereco()
			.stream()
			.map(EnderecoResponse::new)
			.toList();
	}
	
	@PostMapping("endereco")
	public EnderecoResponse createEndereco(@Valid @RequestBody EnderecoRequest newObj) {
		return new EnderecoResponse(facade.saveEndereco(newObj.convertToEntity()));
	}
	
	@GetMapping("endereco/{id}")
	public EnderecoResponse getEnderecoById(@PathVariable Long id) {
		return new EnderecoResponse(facade.findEnderecoById(id));
	}
	
	@PatchMapping("endereco/{id}")
	public EnderecoResponse updateEndereco(@PathVariable Long id, @Valid @RequestBody EnderecoRequest obj) {
			return new EnderecoResponse(facade.updateEndereco(obj, id));
	}
	
	@DeleteMapping("endereco/{id}")
	public String deleteEndereco(@PathVariable Long id) {
		facade.deleteEndereco(id);
		return "";
		
	}
	

}
