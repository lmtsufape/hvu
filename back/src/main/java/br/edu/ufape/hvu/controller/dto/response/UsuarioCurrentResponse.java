package br.edu.ufape.hvu.controller.dto.response;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UsuarioCurrentResponse {
	
	private UsuarioResponse usuario;
	private ArrayList<String> roles;
	
	
	
	
}


