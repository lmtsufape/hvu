package br.edu.ufape.hvu.service;

import java.io.File;
import java.io.InputStream;

public interface FileServiceInterface {
	
	public File findFile(String fileName);
	public String storeFile(InputStream file, String fileName);
	public void deleteFile(String fileName);
}
