package br.edu.ufape.hvu.service;

import java.util.List;
import br.edu.ufape.hvu.exception.FileException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.FotoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Foto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FotoService implements FotoServiceInterface {
    private final FotoRepository fotoRepository;

    @Value("${app.files.upload-fotos.path}")
    private String uploadDir;

    @Value("${app.files.upload-fotos.max-size}")
    private String maxSizeConfig;

    @Value("${app.files.upload-fotos.allowed-types}")
    private List<String> allowedTypes;

    public Foto save(MultipartFile file, String title) {
        validarArquivo(file);

        String extensao = getExtensao(file.getOriginalFilename());
        String novoNome = UUID.randomUUID() + "." + extensao;

        Path diretorio;

        try {
            diretorio = Paths.get(uploadDir);
            if (!Files.exists(diretorio)) {
                Files.createDirectories(diretorio);
            }

            Path filePath = diretorio.resolve(novoNome);
            file.transferTo(filePath);
        } catch (IOException exception) {
            throw new FileException("Erro ao transferir foto para armazenamento.");
        }

        Foto foto = new Foto();
        foto.setTitulo(title);
        foto.setNomeArquivo(novoNome);
        foto.setCaminhoRelativo(diretorio.toString());
        foto.setTipoArquivo(file.getContentType());
        foto.setDataUpload(LocalDateTime.now());

        return fotoRepository.save(foto);
    }

    public Foto findById(long id) {
        return fotoRepository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Foto"));
    }

    public byte[] loadFile(long id) {
        Foto foto = fotoRepository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Foto"));
        Path path = Paths.get(foto.getCaminhoRelativo(), foto.getNomeArquivo());
        try {
            return Files.readAllBytes(path);
        } catch (IOException exception) {
            throw new FileException("Erro ao carregar a foto do armazenamento");
        }
    }

    public List<Foto> findAll() {
        return fotoRepository.findAll();
    }

    public Foto replaceFile(long id, MultipartFile newFile, String newTitle) {
        Foto existingFoto = fotoRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException(id, "Foto"));


        validarArquivo(newFile);

        Path oldPath = Paths.get(existingFoto.getCaminhoRelativo(), existingFoto.getNomeArquivo());
        try {
            Files.deleteIfExists(oldPath);
        } catch (IOException exception) {
            throw new FileException("Erro ao deletar arquivo antigo: " + existingFoto.getNomeArquivo());
        }

        String extensao = getExtensao(newFile.getOriginalFilename());
        String novoNome = UUID.randomUUID() + "." + extensao;

        Path diretorio;
        try {
            diretorio = Paths.get(uploadDir);
            if (!Files.exists(diretorio)) {
                Files.createDirectories(diretorio);
            }

            Path filePath = diretorio.resolve(novoNome);
            newFile.transferTo(filePath);
        } catch (IOException exception) {
            throw new FileException("Erro ao salvar novo arquivo.");
        }

        existingFoto.setTitulo(newTitle);
        existingFoto.setNomeArquivo(novoNome);
        existingFoto.setCaminhoRelativo(diretorio.toString());
        existingFoto.setTipoArquivo(newFile.getContentType());
        existingFoto.setDataUpload(LocalDateTime.now());

        return fotoRepository.save(existingFoto);
    }

    public void delete(long id) {
        Foto existingFoto = fotoRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException(id, "Foto"));

        Path path = Paths.get(existingFoto.getCaminhoRelativo(), existingFoto.getNomeArquivo());
        try {
            Files.deleteIfExists(path);
        } catch (IOException exception) {
            throw new FileException("Erro ao deletar arquivo físico: " + existingFoto.getNomeArquivo());
        }

        fotoRepository.delete(existingFoto);
    }

    private void validarArquivo(MultipartFile file) {
        long maxBytes = parseSize(maxSizeConfig);
        if (file.getSize() > maxBytes) {
            throw new FileException("Foto muito grande. Máximo permitido: " + maxSizeConfig);
        }

        if (!allowedTypes.contains(file.getContentType())) {
            throw new FileException("Tipo de arquivo não permitido: " + file.getContentType());
        }
    }

    private String getExtensao(String nomeArquivo) {
        if (nomeArquivo == null || !nomeArquivo.contains(".")) return "";
        return nomeArquivo.substring(nomeArquivo.lastIndexOf(".") + 1);
    }

    private long parseSize(String size) {
        size = size.toUpperCase().trim();
        if (size.endsWith("MB")) {
            return Long.parseLong(size.replace("MB", "")) * 1024 * 1024;
        } else if (size.endsWith("KB")) {
            return Long.parseLong(size.replace("KB", "")) * 1024;
        } else {
            return Long.parseLong(size);
        }
    }
}
