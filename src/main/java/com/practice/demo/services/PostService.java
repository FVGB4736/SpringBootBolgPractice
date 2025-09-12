package com.practice.demo.services;

import com.practice.demo.domain.dtos.CreatePostRequestDto;
import com.practice.demo.domain.dtos.PostDto;
import com.practice.demo.domain.dtos.UpdatePostRequestDto;
import com.practice.demo.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PostService {

    PostDto getPost(UUID id);

    List<PostDto> getAllPosts(UUID categoryId, UUID tagId);

    List<PostDto> getDraftPosts(User user);

    PostDto createPost(User user, CreatePostRequestDto createPostRequestDto);

    PostDto updatePost(UUID id, UpdatePostRequestDto updatePostRequestDto);

    void deletePost(UUID id);
}
