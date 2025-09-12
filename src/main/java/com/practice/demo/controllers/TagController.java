package com.practice.demo.controllers;

import com.practice.demo.domain.dtos.CreateTagResponse;
import com.practice.demo.domain.dtos.TagDto;
import com.practice.demo.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags(){
        List<TagDto> tags = tagService.getTags();
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<List<TagDto>> createTags(@RequestBody CreateTagResponse createTagResponse){

        List<TagDto> createdTagResponse = tagService.createTags(createTagResponse.getNames());

        return new ResponseEntity<>(
                createdTagResponse,
                HttpStatus.CREATED
        );

    }


    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable UUID id){

        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();

    }

}
