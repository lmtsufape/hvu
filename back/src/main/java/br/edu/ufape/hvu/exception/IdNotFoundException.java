package br.edu.ufape.hvu.exception;

import br.edu.ufape.hvu.exception.types.NotFoundException;

@SuppressWarnings("serial")
public class IdNotFoundException extends NotFoundException {

	public IdNotFoundException(Long Id, String Classe) {
		super("001", ("Id " +Id + " da Classe " +Classe + " não encontrado"));
	}

}
