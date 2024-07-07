package br.edu.ufape.hvu.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.edu.ufape.hvu.exception.FileException;
import br.edu.ufape.hvu.exception.ObjectNotFoundException;

@Service
public class FileService implements FileServiceInterface {

	@Value("${files.storage}")
	private String location;

	public File findFile(String fileName) {
		validateFileName(fileName);
		String caminho = formatedPath(fileName);
		File file = new File(caminho);
		if (file.exists()) {
			return file;
		} else {
			throw new ObjectNotFoundException("It doesn't exist File with name = " + fileName);
		}
	}

	public String storeFile(InputStream file, String fileName) {
		validateFileName(fileName);
		File f = new File(formatedPath(fileName));
		createDir(f.getParentFile());
		try (OutputStream output = new FileOutputStream(f, false)) {
			file.transferTo(output);
			return fileName;
		} catch (IOException e) {
			throw new FileException("Error storing file " + fileName + ": " + e.getMessage());
		} finally {
			try {
				file.close();
			} catch (IOException e) {
				throw new FileException("Error closing InputStream for file " + fileName + ": " + e.getMessage());
			}
		}
	}

	public void deleteFile(String fileName){
		validateFileName(fileName);
		File file = findFile(fileName);
		if (!file.delete()) {
			throw new FileException("Failed to delete file " + fileName);
		}
	}

	private void createDir(File dir) {
		if (!dir.exists()) {
			if (!dir.mkdirs()) {
				throw new FileException("Failed to create directory " + dir.getAbsolutePath());
			}
		}
	}

	private String formatedPath(String fileName) {
		Path path = Paths.get(location, fileName);
		return path.toAbsolutePath().toString();
	}

	private void validateFileName(String fileName) {
		try {
			Paths.get(fileName);
		} catch (InvalidPathException e) {
			throw new FileException("Invalid file name: " + fileName);
		}
	}
}
