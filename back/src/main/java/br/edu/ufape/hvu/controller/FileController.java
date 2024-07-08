package br.edu.ufape.hvu.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import br.edu.ufape.hvu.facade.Facade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/v1/")
public class FileController {
	@Autowired
	private Facade facade;

	@GetMapping(value = "arquivos/{filename}", produces = MediaType.ALL_VALUE)
	public ResponseEntity<byte[]> getFile(@PathVariable String filename) {
		File file;
		try {
			file = facade.findFile(filename);
			try (FileInputStream fileInputStream = new FileInputStream(file)) {
				byte[] bytes = StreamUtils.copyToByteArray(fileInputStream);
				return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(bytes);
			}
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("arquivos")
	public ResponseEntity<List<String>> storageFile(@RequestParam(name = "file") List<MultipartFile> files) {
		List<String> filenames = new ArrayList<>();
		try {
			for (MultipartFile file : files) {
				String filename = facade.storeFile(file.getInputStream(), file.getOriginalFilename());
				filenames.add(filename);
			}
			return ResponseEntity.ok(filenames);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@DeleteMapping("arquivos/{filename}")
	public ResponseEntity<Void> deleteFile(@PathVariable String filename) {
		try {
			facade.deleteFile(filename);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
