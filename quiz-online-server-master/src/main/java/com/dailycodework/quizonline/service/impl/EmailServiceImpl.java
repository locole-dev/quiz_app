package com.dailycodework.quizonline.service.impl;

import com.dailycodework.quizonline.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendVerificationEmail(String toEmail, String verificationLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify your Quiz Online account");
            message.setText("Hello,\n\n"
                    + "Thank you for registering a Quiz Online account. Please click the link below to verify your email address:\n\n"
                    + verificationLink + "\n\n"
                    + "This link will expire in 24 hours. If you did not register this account, please ignore this email.\n\n"
                    + "Best regards,\n"
                    + "Quiz Online Team");
            mailSender.send(message);
            System.out.println("Verification email sent successfully to: " + toEmail);
        } catch (MailException e) {
            System.err.println("Error sending verification email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Unable to send verification email. Please try again later.", e);
        }
    }
}