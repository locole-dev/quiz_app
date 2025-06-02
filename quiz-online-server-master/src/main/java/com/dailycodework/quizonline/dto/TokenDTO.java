package com.dailycodework.quizonline.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class TokenDTO {
    @NonNull
    private String token ;
    @NonNull
    private String refreshToken;
}
