package com.practice.demo.domain.entities;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.practice.demo.domain.PostStatus;

import lombok.Builder;

public class UpdatePostRequest {

    private String title;


    private String content;


    private UUID categoryId;


    @Builder.Default
    private Set<UUID> tagsId = new HashSet<>();


    private PostStatus status;

}
