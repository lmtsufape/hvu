package br.edu.ufape.hvu.exception;

import br.edu.ufape.hvu.exception.types.BusinessException;

@SuppressWarnings("serial")
public class DuplicateAccountException extends BusinessException{
	
	public DuplicateAccountException(String tipo, String campo) {
		super("002", "Já existe um(a) " + tipo + " cadastrado(a) com esse(a) " + campo + ".");
	}
}
