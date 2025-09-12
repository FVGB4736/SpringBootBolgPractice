package com.practice.demo.Config;

import com.practice.demo.repositories.UserRepository;
import com.practice.demo.security.BlogUserDetailService;
import com.practice.demo.security.JwtAuthenticationFilter;
import com.practice.demo.services.AuthenticationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(AuthenticationService authenticationService){
        return new JwtAuthenticationFilter(authenticationService);
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository){
        return new BlogUserDetailService(userRepository);
    }

    /**
     * 配置安全過濾鏈，定義了應用的安全規則
     * 1. 啟用 CORS 配置
     * 2. 配置 URL 授權規則
     * 3. 禁用 CSRF 保護（因為使用 JWT）
     * 4. 設置無狀態會話（因為使用 JWT）
     * 5. 添加 JWT 認證過濾器
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            // 啟用 CORS 配置
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 配置 URL 授權規則
            .authorizeHttpRequests(auth -> auth
                // 允許所有人訪問登入和註冊端點
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                // 草稿必須是登入後才能查看，這行寫在前面，會先被匹配到
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/drafts").authenticated()
                // 公開訪問的 API 端點
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/tags/**").permitAll()
                // 其他所有請求都需要認證
                .anyRequest().authenticated()
            )
            // 禁用 CSRF 保護（因為我們使用 JWT）
            .csrf(csrf -> csrf.disable())
            // 設置無狀態會話（因為我們使用 JWT）
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // 在 UsernamePasswordAuthenticationFilter 之前添加 JWT 過濾器
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 配置 CORS (跨來源資源共享) 規則
     * 1. 允許來自前端應用的跨域請求
     * 2. 配置允許的 HTTP 方法、標頭和憑證
     * 3. 應用到所有端點 (/**)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 允許的前端網址（開發環境）
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        // 允許的 HTTP 方法
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 允許的請求標頭
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // 允許發送認證信息（如 cookies）
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 將 CORS 配置應用到所有端點
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }


    //AuthenticationManager 會自動與 PasswordEncoder 協作，確保認證流程中的密碼驗證是安全的。
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }


}
