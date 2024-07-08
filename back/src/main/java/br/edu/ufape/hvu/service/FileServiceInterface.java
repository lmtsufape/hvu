package br.edu.ufape.hvu.service;

import java.io.File;
import java.io.InputStream;

import br.edu.ufape.hvu.exception.ObjectNotFoundException;

public interface FileServiceInterface {
	
	public File findFile(String fileName);
	public String storeFile(InputStream file, String fileName);
	public void deleteFile(String fileName);
}
