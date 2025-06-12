package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.FotoRequest;
import br.edu.ufape.hvu.controller.dto.response.FotoResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class FotoController {
	private final Facade facade;
	
	@GetMapping("foto")
	public List<FotoResponse> getAllFoto() {
		return facade.getAllFoto()
			.stream()
			.map(FotoResponse::new)
			.toList();
	}
	
	@PostMapping("foto")
	public FotoResponse createFoto(@Valid @RequestBody FotoRequest newObj) {
		return new FotoResponse(facade.saveFoto(newObj.convertToEntity()));
	}
	
	@GetMapping("foto/{id}")
	public FotoResponse getFotoById(@PathVariable Long id) {
		return new FotoResponse(facade.findFotoById(id));
	}
	
	@PatchMapping("foto/{id}")
	public FotoResponse updateFoto(@PathVariable Long id, @Valid @RequestBody FotoRequest obj) {
			return new FotoResponse(facade.updateFoto(obj, id));
	}
	
	@DeleteMapping("foto/{id}")
	public String deleteFoto(@PathVariable Long id) {
		facade.deleteFoto(id);
		return "";
	}
	

}
