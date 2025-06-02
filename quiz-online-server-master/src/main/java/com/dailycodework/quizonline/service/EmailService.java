package com.dailycodework.quizonline.service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String verificationLink);
}
