package com.dailycodework.quizonline.service;

import com.dailycodework.quizonline.model.Account;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountService extends UserDetailsService {
    Account getAccountByUsername (String username);

}
