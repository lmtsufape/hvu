package br.edu.ufape.hvu.controller;

import br.edu.ufape.hvu.controller.dto.auth.TokenResponse;
import br.edu.ufape.hvu.controller.dto.request.EmailRequest;
import br.edu.ufape.hvu.exception.types.auth.KeycloakAuthenticationException;
import br.edu.ufape.hvu.facade.Facade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    final private Facade facade;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestParam("email") String username, @RequestParam("senha") String password) {
        TokenResponse response = facade.login(username, password);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestParam("refresh_token") String refreshToken) {
        TokenResponse response = facade.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody EmailRequest email) {
        try {
            facade.forgetPassword(email.convertToString());
            return ResponseEntity.ok("Email de redefinição de senha enviado com sucesso.");
        } catch (KeycloakAuthenticationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

