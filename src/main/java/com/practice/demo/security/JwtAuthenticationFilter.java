package com.practice.demo.security;

import com.practice.demo.services.AuthenticationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// 標記為 Spring 的過濾器，負責處理 JWT 認證
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // 注入 AuthenticationService，用來驗證 Token
    private final AuthenticationService authenticationService;

    // 實現過濾器的核心邏輯，檢查每個請求的 JWT Token
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            // 從請求的 Header 提取 JWT Token
            String token = this.extractToken(request);

            // 如果 Token 存在，進行驗證
            if (token != null) {
                // 用 AuthenticationService 驗證 Token，取得使用者資訊
                UserDetails userDetails = authenticationService.validateToken(token);

                // 創建 Spring Security 的認證物件
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, // 使用者資訊
                        null,        // 密碼（這裡不需要，因為 Token 已驗證）
                        userDetails.getAuthorities() // 使用者的權限（如角色）
                );

                // 將認證物件存到 SecurityContext，告訴 Spring Security 使用者已認證
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 如果 UserDetails 是 BlogUserDetails 型別，提取 userId 並存到請求屬性
                if (userDetails instanceof BlogUserDetails) {
                    request.setAttribute("userId", ((BlogUserDetails) userDetails).getId());
                }
            }

        } catch (Exception ex) {
            // 如果 Token 無效或有其他錯誤，記錄日誌但不拋出異常
            log.warn("Received invalid auth token", ex.toString());
        }

        // 繼續執行過濾器鏈，讓請求繼續處理（不中斷）
        filterChain.doFilter(request, response);
    }

    // 從 HTTP 請求的 Authorization Header 提取 JWT Token
    private String extractToken(HttpServletRequest request) {
        // 取得 Authorization Header
        String bearerToken = request.getHeader("Authorization");

        // 檢查是否有 Token 且以 "Bearer " 開頭
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            // 去掉 "Bearer " 前綴，取得純 Token
            return bearerToken.substring(7);
        }

        // 如果沒有 Token 或格式不對，返回 null
        return null;
    }
}