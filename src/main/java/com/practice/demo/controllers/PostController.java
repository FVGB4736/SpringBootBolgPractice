package com.practice.demo.controllers;

import com.practice.demo.domain.dtos.CreatePostRequestDto;
import com.practice.demo.domain.dtos.PostDto;
import com.practice.demo.domain.dtos.UpdatePostRequestDto;
import com.practice.demo.domain.entities.CreatePostRequest;
import com.practice.demo.domain.entities.User;
import com.practice.demo.services.PostService;
import com.practice.demo.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping(path = "/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID tagId){

        List<PostDto> postDtos = postService.getAllPosts(categoryId, tagId);

        return ResponseEntity.ok(postDtos);
    }

    @GetMapping(path = "/drafts")
    public ResponseEntity<List<PostDto>> getDrafts(@RequestAttribute UUID userId){
        User loggedInUser = userService.getUserById(userId);

        List<PostDto> postDtos = postService.getDraftPosts(loggedInUser);

        return ResponseEntity.ok(postDtos);
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody CreatePostRequestDto createPostRequestDto,
            @RequestAttribute UUID userId){

        User loggedInUser = userService.getUserById(userId);

        PostDto createdPostDto = postService.createPost(loggedInUser, createPostRequestDto);

        return new ResponseEntity<>(createdPostDto, HttpStatus.CREATED);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePostRequestDto updatePostRequestDto){
        PostDto updatedPostDto = postService.updatePost(id, updatePostRequestDto);
        return ResponseEntity.ok(updatedPostDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPost(@PathVariable UUID id) {
        PostDto postDto = postService.getPost(id);
        return ResponseEntity.ok(postDto);
    }
    

}
