package br.edu.ufape.hvu.exception;

import br.edu.ufape.hvu.exception.types.BusinessException;

@SuppressWarnings("serial")
public class DuplicateAccountException extends BusinessException{
	
	public DuplicateAccountException(String type) {
		super("002", "Ja existe uma conta " + type + " com essas informacoes de cadastro");
	}
}
