package br.edu.ufape.hvu.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.FichaRequest;
import br.edu.ufape.hvu.controller.dto.response.FichaResponse;

@RestController
@RequestMapping("/api/v1/")
public class FichaController {
    @Autowired
    private Facade facade;

   // @PreAuthorize("hasAnyRole('SECRETARIO','MEDICO')")
    @GetMapping("ficha")
    public List<FichaResponse> getAllFicha() {
        return facade.getAllFicha()
                .stream()
                .map(FichaResponse::new)
                .toList();
    }

  //  @PreAuthorize("hasAnyRole('SECRETARIO','MEDICO')")
    @PostMapping("ficha")
    public FichaResponse createFicha(@Valid @RequestBody FichaRequest newObj) {
        return new FichaResponse(facade.saveFicha(newObj.convertToEntity()));
    }

 //   @PreAuthorize("hasAnyRole('TUTOR','SECRETARIO','MEDICO' )")
    @GetMapping("ficha/{id}")
    public FichaResponse getFichaById(@PathVariable Long id) {
        return new FichaResponse(facade.findFichaById(id));
    }

    //@PreAuthorize("hasAnyRole('SECRETARIO','MEDICO')")
    @PatchMapping("ficha/{id}")
    public FichaResponse updateFicha(@PathVariable Long id, @Valid @RequestBody FichaRequest obj) {
        return new FichaResponse(facade.updateFicha(obj, id));
    }

//    @PreAuthorize("hasAnyRole('SECRETARIO','MEDICO')")
    @DeleteMapping("ficha/{id}")
    public String deleteFicha(@PathVariable Long id) {
        facade.deleteFicha(id);
        return "";
    }
}