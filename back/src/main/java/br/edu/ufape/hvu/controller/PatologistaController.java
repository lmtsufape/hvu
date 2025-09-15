package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.edu.ufape.hvu.controller.dto.request.PatologistaRequest;
import br.edu.ufape.hvu.controller.dto.response.PatologistaResponse;
import br.edu.ufape.hvu.facade.Facade;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class PatologistaController {
    private final Facade facade;

    @PreAuthorize("hasAnyRole('ADMIN_LAPA', 'PATOLOGISTA')")
    @GetMapping("patologista")
    public List<PatologistaResponse> getAllPatologista() {
        return facade.getAllPatologista()
                .stream()
                .map(PatologistaResponse::new)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN_LAPA')")
    @PostMapping("patologista")
    public PatologistaResponse createPatologista(@Valid @RequestBody PatologistaRequest newObj) {
        return new PatologistaResponse(facade.savePatologista(newObj, newObj.getSenha()));
    }

    @PreAuthorize("hasAnyRole('ADMIN_LAPA', 'PATOLOGISTA')")
    @GetMapping("patologista/{id}")
    public PatologistaResponse getPatologistaById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
        return new PatologistaResponse(facade.findPatologistaById(id, principal.getSubject()));
    }

    @PreAuthorize("hasAnyRole('ADMIN_LAPA', 'PATOLOGISTA')")
    @PatchMapping("patologista/{id}")
    public PatologistaResponse updatePatologista(@PathVariable Long id, @Valid @RequestBody PatologistaRequest obj) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();
        return new PatologistaResponse(facade.updatePatologista(id, obj, principal.getSubject()));
    }

    @PreAuthorize("hasRole('ADMIN_LAPA')")
    @DeleteMapping("patologista/{id}")
    public String deletePatologista(@PathVariable Long id) {
        facade.deletePatologista(id);
        return "";
    }

}
