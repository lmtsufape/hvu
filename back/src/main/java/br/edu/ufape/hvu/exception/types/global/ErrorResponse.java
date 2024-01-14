package br.edu.ufape.hvu.exception.types.global;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
public class ErrorResponse {
    public String code;
    public String message;
}
