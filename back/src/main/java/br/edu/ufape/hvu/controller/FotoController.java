package br.edu.ufape.hvu.controller;

import java.util.List;
import java.util.stream.Collectors;
import br.edu.ufape.hvu.model.Foto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.response.FotoResponse;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/fotos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATOLOGISTA')")
public class FotoController {
    private final Facade facade;

    @PostMapping
    public ResponseEntity<FotoResponse> uploadFoto(@RequestParam("file") MultipartFile file,
                                                   @RequestParam("titulo") String titulo) {
        Foto foto = facade.saveFoto(file, titulo);
        return ResponseEntity.ok(new FotoResponse(foto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FotoResponse> replaceFoto(@PathVariable long id,
                                                    @RequestParam("file") MultipartFile newFile,
                                                    @RequestParam("titulo") String newTitle) {
        Foto foto = facade.replaceFoto(id, newFile, newTitle);
        return ResponseEntity.ok(new FotoResponse(foto));
    }

    @GetMapping
    public ResponseEntity<List<FotoResponse>> getAllFotos() {
        List<FotoResponse> fotos = facade.findllFotos()
                .stream()
                .map(FotoResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(fotos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getFotoById(@PathVariable long id) {
        byte[] fileData = facade.loadFotoFile(id);
        Foto foto = facade.findFotoById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(foto.getTipoArquivo()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + foto.getNomeArquivo() + "\"")
                .body(fileData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoto(@PathVariable long id) {
        facade.deleteFoto(id);
        return ResponseEntity.noContent().build();
    }
}
