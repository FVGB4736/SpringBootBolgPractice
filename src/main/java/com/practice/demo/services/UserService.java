package com.practice.demo.services;

import com.practice.demo.domain.entities.User;

import java.util.UUID;

public interface UserService {

    User getUserById(UUID id);


}
