package br.edu.ufape.hvu.exception.types;

import br.edu.ufape.hvu.exception.types.global.ExceptionCustomized;

@SuppressWarnings("serial")
public class NotFoundException extends ExceptionCustomized{
    public NotFoundException(String code, String message) {
        super(code, message);
    }
}