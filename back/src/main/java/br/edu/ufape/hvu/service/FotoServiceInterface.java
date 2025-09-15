package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Foto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface FotoServiceInterface {
    Foto save(MultipartFile file, String titulo);
    Foto replaceFile(long id, MultipartFile newFile, String novoTitulo);
    Foto findById(long id);
    byte[] loadFile(long id);
    List<Foto> findAll();
    void delete(long id);
}
