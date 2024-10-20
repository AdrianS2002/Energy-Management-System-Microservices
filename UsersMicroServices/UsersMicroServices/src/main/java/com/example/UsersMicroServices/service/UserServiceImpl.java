package com.example.UsersMicroServices.service;


import com.example.UsersMicroServices.dto.*;
import com.example.UsersMicroServices.exceptions.ApiExceptionResponse;
import com.example.UsersMicroServices.mapper.UserMapper;
import com.example.UsersMicroServices.mapper.UserToLoginMapper;
import com.example.UsersMicroServices.mapper.UserToLogoutMapper;
import com.example.UsersMicroServices.model.Role;
import com.example.UsersMicroServices.model.User;
import com.example.UsersMicroServices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{
   @Autowired
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));
    }


    @Override
    public User findByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public UserDTO createUser(UserCreationDTO userCreationDTO) {
        User entity = UserMapper.toCreateEntity(userCreationDTO);
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        if(entity.getRole() == null) {
            entity.setRole(Role.USER);
        }
        entity = userRepository.save(entity);
        return UserMapper.toDTO(entity);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
         if(userDTO.getUserId() == null) {
             throw new RuntimeException("User ID is missing");
         }
         User entity = userRepository.findById(userDTO.getUserId()).orElseThrow(()->new RuntimeException("User not found"));
            entity.setUsername(userDTO.getUsername());
            entity.setEmail(userDTO.getEmail());
            entity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            entity.setTelephone(userDTO.getTelephone());
            userRepository.save(entity);
            return UserMapper.toDTO(entity);
    }



    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);

    }

    @Override
    public UserDTO assignRole(Long userId, String role) {
        User entity = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        try {
            entity.setRole(Role.valueOf(role));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role not found");
        }
        userRepository.save(entity);
        return UserMapper.toDTO(entity);
    }

    @Override
    public UserDTO updateUserRole(Long userId, Role role) {
        boolean exists = userRepository.findById(userId).isPresent();
        if (exists) {
            User user = userRepository.findById(userId).get();
            user.setRole(role);
            userRepository.save(user);
            return UserMapper.toDTO(user);
        }
        return null;
    }

    @Override
    public UserDTO updateAllUser(Long userId, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Actualizează valorile din userDTO dacă sunt prezente
        if (userUpdateDTO.getUserDTO() != null) {
            if (userUpdateDTO.getUserDTO().getUsername() != null) {
                user.setUsername(userUpdateDTO.getUserDTO().getUsername());
            }
            if (userUpdateDTO.getUserDTO().getEmail() != null) {
                user.setEmail(userUpdateDTO.getUserDTO().getEmail());
            }
            if (userUpdateDTO.getUserDTO().getPassword() != null) {
                user.setPassword(passwordEncoder.encode(userUpdateDTO.getUserDTO().getPassword()));
            }
            if (userUpdateDTO.getUserDTO().getTelephone() != null) {
                user.setTelephone(userUpdateDTO.getUserDTO().getTelephone());
            }
        }

        // Actualizează câmpurile din UserUpdateDTO (care sunt separate de userDTO)
        if (userUpdateDTO.getEmail() != null) {
            user.setEmail(userUpdateDTO.getEmail());
        }
        if (userUpdateDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
        }
        if (userUpdateDTO.getTelephone() != null) {
            user.setTelephone(userUpdateDTO.getTelephone());
        }
        if (userUpdateDTO.getUsername() != null) {
            user.setUsername(userUpdateDTO.getUsername());
        }
        if (userUpdateDTO.getRole() != null) {
            user.setRole(userUpdateDTO.getRole());
        }

        // Salvează utilizatorul
        userRepository.save(user);

        // Returnează utilizatorul actualizat
        return UserMapper.toDTO(user);
    }



    @Override
    public SuccessfulLoginDTO login(AuthDTO auth) throws ApiExceptionResponse {
        User user = userRepository.findUserByUsername(auth.getUsername());
        if (user == null ||   !passwordEncoder.matches(auth.getPassword(), user.getPassword())){
            ArrayList<String> errors = new ArrayList<>();
            errors.add("Invalid username or password.");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Authentication failed")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        // Mapping user to SuccessfulLoginDTO
        return UserToLoginMapper.mapUserToDTO(user);
    }

    @Override
    public SuccessfulLogoutDTO logout(LogoutDTO dto) throws ApiExceptionResponse {
        User user = userRepository.findUserByUsername(dto.getUsername());
        if (user == null) {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("Invalid username or password.");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Authentication failed")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        userRepository.save(user);
        return UserToLogoutMapper.mapUserToDTO(user);
    }

}
