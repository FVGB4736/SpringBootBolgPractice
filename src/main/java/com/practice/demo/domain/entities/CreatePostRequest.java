package com.practice.demo.domain.entities;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.practice.demo.domain.PostStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostRequest {


    private String title;


    private String content;


    private UUID categoryId;


    @Builder.Default
    private Set<UUID> tagsId = new HashSet<>();


    private PostStatus status;
}
