package br.edu.ufape.hvu.controller;

import br.edu.ufape.hvu.controller.dto.request.AvisoRequest;
import br.edu.ufape.hvu.controller.dto.response.AvisoResponse;
import br.edu.ufape.hvu.facade.Facade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class AvisoController {
    private final Facade facade;

    @PreAuthorize("hasRole('SECRETARIO')")
    @GetMapping("aviso")
    public List<AvisoResponse> getAllAviso() {
        return facade.getAllAviso()
                .stream()
                .map(AvisoResponse::new)
                .toList();
    }

    @GetMapping("aviso/habilitados")
    public List<AvisoResponse> getAvisosHabilitados() {
        return facade.findAvisosHabilitados()
                .stream()
                .map(AvisoResponse::new)
                .toList();
    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @PostMapping("aviso")
    public AvisoResponse createAviso(@Valid @RequestBody AvisoRequest newObj) {
        return new AvisoResponse(facade.saveAviso(newObj.convertToEntity()));
    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @GetMapping("aviso/{id}")
    public AvisoResponse getAvisoById(@PathVariable Long id) {
        return new AvisoResponse(facade.findAvisoById(id));
    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @PatchMapping("aviso/{id}")
    public AvisoResponse updateAviso(@PathVariable Long id, @Valid @RequestBody AvisoRequest obj) {
        return new AvisoResponse(facade.updateAviso(obj, id));
    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @DeleteMapping("aviso/{id}")
    public String deleteAviso(@PathVariable Long id) {
        facade.deleteAviso(id);
        return "";
    }

}
