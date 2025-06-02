package com.dailycodework.quizonline.service;

import com.dailycodework.quizonline.dto.TokenDTO;
import com.dailycodework.quizonline.model.Account;
import com.dailycodework.quizonline.model.Token;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;

public interface JWTTokenService {
    // Định nghĩa 5 hàm generateJWTToken , parseTokenToUserInformation
    // và generateRefreshToken, isRefreshTokenValid , getNewToken
    String generateJWTToken(String username);
    Authentication parseTokenToUserInformation(HttpServletRequest request);
    // this function use in each request
    Token generateRefreshToken(Account user);
    Boolean isRefreshTokenValid(String refreshToken);
    TokenDTO getNewToken(String refreshToken);

}
