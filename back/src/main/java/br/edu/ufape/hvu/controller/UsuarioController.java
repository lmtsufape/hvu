package br.edu.ufape.hvu.controller;

import java.util.ArrayList;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nimbusds.jose.shaded.gson.internal.LinkedTreeMap;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.UsuarioRequest;
import br.edu.ufape.hvu.controller.dto.response.UsuarioResponse;
import br.edu.ufape.hvu.controller.dto.response.UsuarioCurrentResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class UsuarioController {
	private final Facade facade;
	
	@PostMapping("usuario")
	public UsuarioResponse createUsuario(@RequestBody @Valid UsuarioRequest newObj) {
		return new UsuarioResponse(facade.saveUsuario(newObj.convertToEntity()));
	}

	@GetMapping("usuario/{id}")
	public UsuarioResponse getUsuarioById(@PathVariable @NotNull Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new UsuarioResponse(facade.findUsuarioById(id, principal.getSubject()));
	}

	@GetMapping("usuario/current")
	public UsuarioCurrentResponse getCurrentUsuario() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		LinkedTreeMap<String,ArrayList<String>> tree = principal.getClaim("realm_access");
		ArrayList<String> roles = tree.get("roles");
			
		return new UsuarioCurrentResponse(new UsuarioResponse( facade.findUsuarioByUserId(principal.getSubject())), roles);
	}

	@PatchMapping("usuario/{id}")
	public UsuarioResponse updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new UsuarioResponse(facade.updateUsuario(id, obj, principal.getSubject()));
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', 'ADMIN_LAPA')")
	@DeleteMapping("usuario/{id}")
	public String deleteUsuario(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
		facade.deleteUsuario(id, principal.getSubject());
		return "";
	}

}
