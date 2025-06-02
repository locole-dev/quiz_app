package com.dailycodework.quizonline.service;

import com.dailycodework.quizonline.dto.LoginInfoDTO;
import com.dailycodework.quizonline.form.account.RegisterRequest;
import com.dailycodework.quizonline.model.Account;

import java.util.Optional;

public interface AuthService {
    LoginInfoDTO login(String username);
    Account registerNewAccount(RegisterRequest registerRequest);
    boolean verifyEmail(String token);
    boolean isAccountEnabled(String email);
    Optional<Account> findByEmail(String email);
}

