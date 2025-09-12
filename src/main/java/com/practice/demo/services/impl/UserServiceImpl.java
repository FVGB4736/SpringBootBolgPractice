package com.practice.demo.services.impl;

import com.practice.demo.domain.entities.User;
import com.practice.demo.repositories.UserRepository;
import com.practice.demo.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    @Override
    public User getUserById(UUID id) {
        Optional<User> user = userRepository.findById(id);

        if(user.isEmpty()){
            throw new EntityNotFoundException("User not found with ID "+id);
        }

        return user.get();
    }
}
