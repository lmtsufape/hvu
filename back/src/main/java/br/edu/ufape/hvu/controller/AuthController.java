package br.edu.ufape.hvu.controller;

import br.edu.ufape.hvu.controller.dto.auth.TokenResponse;
import br.edu.ufape.hvu.controller.dto.request.EmailRequest;
import br.edu.ufape.hvu.facade.Facade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final Facade facade;

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
        facade.forgetPassword(email.convertToString());
        return ResponseEntity.ok("Email de redefinição de senha enviado com sucesso.");
    }

}
