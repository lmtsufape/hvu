package br.edu.ufape.hvu.controller.dto.auth;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class TokenResponse {
    private String access_token;
    private String refresh_token;
    private String expires_in;
    private String token_type;
    private String scope;
    private List<String> roles;


}