package com.dailycodework.quizonline.service.impl;

import com.dailycodework.quizonline.dto.TokenDTO;
import com.dailycodework.quizonline.model.Account;
import com.dailycodework.quizonline.model.Token;
import com.dailycodework.quizonline.repository.TokenRepository;
import com.dailycodework.quizonline.service.AccountService;
import com.dailycodework.quizonline.service.JWTTokenService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class JWTTokenServiceImpl implements JWTTokenService {
    @Value("${jwt.token.time.expiration}")
    private long EXPIRATION_TIME;

    @Value("${jwt.token.secret}")
    private String SECRET;

    @Value("${jwt.token.header.authorization}")
    private String TOKEN_AUTHORIZATION;

    @Value("${jwt.token.prefix}")
    private String TOKEN_PREFIX;

    @Value("${jwt.refreshtoken.time.expiration}")
    private long REFRESH_EXPIRATION_TIME;

    @Autowired
    private AccountService userService;
    @Autowired
    private TokenRepository tokenRepository;

    @Override
    public String generateJWTToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
    }

    @Override
    public Authentication parseTokenToUserInformation(HttpServletRequest request) {
        String token = request.getHeader(TOKEN_AUTHORIZATION);
        if (token == null) return null;
        try {
            String username = Jwts.parser()
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                    .getBody()
                    .getSubject();
            Account user = userService.getAccountByUsername(username);
            String roleName = user.getRole().toString();

            // Đảm bảo vai trò có tiền tố "ROLE_" và chữ HOA
            String prefixedRole = "ROLE_" + roleName.toUpperCase(); // Rất quan trọng

            // Tạo UsernamePasswordAuthenticationToken với vai trò đã có tiền tố
            return new UsernamePasswordAuthenticationToken(
                    user.getUsername(), // Principal
                    null,              // Credentials (thường là null sau khi xác thực JWT)
                    AuthorityUtils.createAuthorityList(prefixedRole));
           // return username != null ? new UsernamePasswordAuthenticationToken(user.getUsername(), null, AuthorityUtils.createAuthorityList(user.getRole().toString())) : null;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    @Transactional
    public Token generateRefreshToken(Account user) {
        Token refreshToken = new Token(user, UUID.randomUUID().toString(), Token.Type.REFRESH_TOKEN, new Date(new Date().getTime() + REFRESH_EXPIRATION_TIME));
        tokenRepository.deleteTokenByAccount(user);
        String newAccessToken = generateJWTToken(user.getUsername());
        return tokenRepository.save(refreshToken);
    }

    @Override
    public Boolean isRefreshTokenValid(String refreshToken) {
        Token refreshTokenEntity = tokenRepository.findTokenByKey(refreshToken);
        if (refreshTokenEntity == null || refreshTokenEntity.getExpiredDate().before(new Date())) return false;
        return true;
    }

    @Override
    public TokenDTO getNewToken(String refreshToken) {
        Token oldRefreshToken = tokenRepository.findTokenByKey(refreshToken);
        tokenRepository.deleteTokenByAccount(oldRefreshToken.getAccount());
        String newToken = generateJWTToken(oldRefreshToken.getAccount().getUsername());
        Token newRefreshToken = generateRefreshToken(oldRefreshToken.getAccount());
        return new TokenDTO(newToken, newRefreshToken.getKey());
    }
}