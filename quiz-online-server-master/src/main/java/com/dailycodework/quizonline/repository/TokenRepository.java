package com.dailycodework.quizonline.repository;

import com.dailycodework.quizonline.model.Account;
import com.dailycodework.quizonline.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TokenRepository extends JpaRepository<Token, Integer>, JpaSpecificationExecutor<Token> {
    void deleteTokenByAccount(Account user);
    Token findTokenByKey(String key);

}
