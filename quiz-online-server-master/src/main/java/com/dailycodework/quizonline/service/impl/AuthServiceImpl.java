package com.dailycodework.quizonline.service.impl;

import com.dailycodework.quizonline.dto.LoginInfoDTO;
import com.dailycodework.quizonline.form.account.RegisterRequest;
import com.dailycodework.quizonline.model.Account;
import com.dailycodework.quizonline.model.Token;
import com.dailycodework.quizonline.repository.AccountRepository;
import com.dailycodework.quizonline.service.AccountService;
import com.dailycodework.quizonline.service.AuthService;
import com.dailycodework.quizonline.service.EmailService;
import com.dailycodework.quizonline.service.JWTTokenService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AccountService accountService;
    @Autowired
    private JWTTokenService jwtTokenService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    @Override
    public LoginInfoDTO login(String username) {
        Account user = accountService.getAccountByUsername(username);
        LoginInfoDTO dto = modelMapper.map(user, LoginInfoDTO.class);
        dto.setAccessToken(jwtTokenService.generateJWTToken(username));
        Token refreshToken = jwtTokenService.generateRefreshToken(user);
        dto.setRefreshToken(refreshToken.getKey());
        return dto;
    }

    @Override
    @Transactional
    public Account registerNewAccount(RegisterRequest registerRequest) {
        if (accountRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }
        if (accountRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        Account account = new Account();
        account.setUsername(registerRequest.getUsername());
        account.setEmail(registerRequest.getEmail());
        account.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        account.setVerificationToken(UUID.randomUUID().toString());
        account.setTokenExpiryDate(LocalDateTime.now().plusHours(24));
        account.setEnabled(false);
        if (registerRequest.getRole() == null || registerRequest.getRole().isEmpty()) {
            account.setRole("USER");
        } else {
            account.setRole(registerRequest.getRole().toUpperCase());
        }
        Account savedAccount = accountRepository.save(account);
        String verificationLink = "http://localhost:5173/verify-email?token=" + savedAccount.getVerificationToken();
        emailService.sendVerificationEmail(savedAccount.getEmail(), verificationLink);

        return savedAccount;
    }

    @Override
    public boolean verifyEmail(String token) {
        Optional<Account> accountOptional = accountRepository.findByVerificationToken(token);

        if (accountOptional.isEmpty()) {
            return false;
        }

        Account account = accountOptional.get();

        if (account.getTokenExpiryDate() != null && account.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
            account.setVerificationToken(null);
            account.setTokenExpiryDate(null);
            accountRepository.save(account);
            return false;
        }

        account.setEnabled(true);
        account.setVerificationToken(null);
        account.setTokenExpiryDate(null);
        accountRepository.save(account);
        return true;
    }

    @Override
    public boolean isAccountEnabled(String email) {
        Optional<Account> accountOptional = accountRepository.findByUsername(email);
        return accountOptional.map(Account::isEnabled).orElse(false);
    }

    @Override
    public Optional<Account> findByEmail(String email){
        return accountRepository.findByEmail(email);
    }
}