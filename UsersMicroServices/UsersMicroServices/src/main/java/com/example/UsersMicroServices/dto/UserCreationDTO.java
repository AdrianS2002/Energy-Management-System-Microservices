package com.example.UsersMicroServices.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserCreationDTO {
    private String username;
    private String email;
    private String password;
    private String telephone;
}
