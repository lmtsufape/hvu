package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.controller.dto.auth.TokenResponse;
import br.edu.ufape.hvu.exception.types.auth.KeycloakAuthenticationException;
import jakarta.annotation.PostConstruct;

public interface KeycloakServiceInterface {
    @PostConstruct
    void init();

    TokenResponse login(String email, String password) throws KeycloakAuthenticationException;

    TokenResponse refreshToken(String refreshToken);

    void createUser(String username, String email, String password, String role) throws KeycloakAuthenticationException;

    void updateUser(String userId, String email);

    void deleteUser(String userId);

    String getUserId(String username);

    boolean hasRoleSecretario(String accessToken);

    boolean hasRoleMedico(String accessToken);

    boolean hasRoleAdminLapa(String accessToken);
}
