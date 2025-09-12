package com.practice.demo.controllers;

import com.practice.demo.domain.dtos.AuthResponse;
import com.practice.demo.domain.dtos.LoginRequest;
import com.practice.demo.services.AuthenticationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    /**
     * Login endpoint, responsible for generating a JWT token given a valid
     * email and password combination.
     *
     * @param loginRequest the email and password of the user to login
     *
     * @return a ResponseEntity containing the generated JWT token, its expiration
     *         time, the user's email address and name, if any
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
        UserDetails userDetails = authenticationService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword()

        );

        String tokenValue = authenticationService.generateToken(userDetails);

        AuthResponse authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400)
                .email(userDetails.getUsername())
                .name((userDetails instanceof com.practice.demo.security.BlogUserDetails)
                        ? ((com.practice.demo.security.BlogUserDetails) userDetails).getUser().getName()
                        : null)
                .build();

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req){
        var userDetails = authenticationService.register(req.getEmail(), req.getPassword(), req.getName());
        String tokenValue = authenticationService.generateToken(userDetails);
        return ResponseEntity.ok(AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400)
                .email(userDetails.getUsername())
                .name(req.getName())
                .build());
    }

    @Data
    public static class RegisterRequest{
        private String email;
        private String password;
        private String name;
    }

}
