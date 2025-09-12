package com.practice.demo.services.impl;

import com.practice.demo.repositories.UserRepository;
import com.practice.demo.domain.entities.User;
import com.practice.demo.services.AuthenticationService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


//整體運作流程（在網頁專案中）

//使用者在網頁登入頁輸入 email/password，送 POST 請求到後端 Controller。
//Controller 呼叫這個服務的 authenticate(email, password)：驗證成功，返回 UserDetails。
//然後呼叫 generateToken(userDetails)：產生 Token，返回給前端。
//前端存 Token（比如 localStorage），之後的請求在 header 加 "Authorization: Bearer [Token]"。
//後端收到請求時，會驗證 Token（你可能有另一個 Filter 或方法來 parse Token，檢查簽名和過期）。



@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;

    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String secretkey;

    private final Long jwtExpiryMs =  86400000L;


    @Override
    public UserDetails authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        return userDetailsService.loadUserByUsername(email);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims =new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiryMs))
                .signWith(this.getSignKey(), SignatureAlgorithm.HS256)
                .compact();

    }

    @Override
    public UserDetails validateToken(String token) {
        String username = this.extractUsername(token);

        return userDetailsService.loadUserByUsername(username);
    }

    @Override
    public UserDetails register(String email, String rawPassword, String name) {
        if(userRepository.findByEmail(email).isPresent()){
            throw new IllegalStateException("Email already in use");
        }

        // 使用預設的 DelegatingPasswordEncoder 以符合 Spring Security 的 {id} 前綴格式
        String encoded = org.springframework.security.crypto.factory.PasswordEncoderFactories
                .createDelegatingPasswordEncoder()
                .encode(rawPassword);

        User user = User.builder()
                .email(email)
                .password(encoded)
                .name(name)
                .build();

        userRepository.save(user);
        return userDetailsService.loadUserByUsername(email);
    }

    private String extractUsername(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();

    }

    private Key getSignKey(){
        byte[] keyBytes = secretkey.getBytes();

        return Keys.hmacShaKeyFor(keyBytes);
    }


}
