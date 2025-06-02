package com.dailycodework.quizonline.dto;


import lombok.Data;

@Data
public class LoginInfoDTO {
    private long userId;
    private String fullName ;
    private  String userName;
    private String role ;
    private String refreshToken ;
    private String accessToken ;
}

