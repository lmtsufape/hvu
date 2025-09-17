package br.edu.ufape.hvu.controller.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter @Setter @NoArgsConstructor
public class FotoRequest {
    private MultipartFile arquivo;
    private String titulo;
}
