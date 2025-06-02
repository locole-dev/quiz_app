package com.dailycodework.quizonline.controller;

import com.dailycodework.quizonline.dto.TokenDTO;
import com.dailycodework.quizonline.form.account.RegisterRequest;
import com.dailycodework.quizonline.form.login.LoginForm;
import com.dailycodework.quizonline.model.Account;
import com.dailycodework.quizonline.service.AuthService;
import com.dailycodework.quizonline.service.JWTTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JWTTokenService jwtTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginForm loginForm){
        if (!authService.isAccountEnabled(loginForm.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để kích hoạt.");
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginForm.getUsername(), loginForm.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return ResponseEntity.ok( authService.login(loginForm.getUsername()));
    }

    @GetMapping("/refreshtoken")
    public TokenDTO refreshToken(String refreshToken) {
        return jwtTokenService.getNewToken(refreshToken);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Gọi AuthService để đăng ký tài khoản mới và gửi email xác minh
            authService.registerNewAccount(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản của bạn.");
        } catch (IllegalArgumentException e) {
            // Xử lý các lỗi nghiệp vụ như email đã tồn tại
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Xử lý các lỗi không mong muốn khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi trong quá trình đăng ký: " + e.getMessage());
        }
    }

    // --- Endpoint mới để xác minh email ---
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        try {
            boolean isVerified = authService.verifyEmail(token);
            if (isVerified) {
                return ResponseEntity.ok("Xác minh email thành công! Bạn có thể đăng nhập ngay bây giờ.");
            } else {
                return ResponseEntity.badRequest().body("Token xác minh không hợp lệ hoặc đã hết hạn.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi trong quá trình xác minh email: " + e.getMessage());
        }
    }
}


