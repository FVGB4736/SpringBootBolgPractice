package com.practice.demo.controllers;

import com.practice.demo.domain.dtos.CategoryDto;
import com.practice.demo.domain.dtos.CreateCategoryRequest;
import com.practice.demo.domain.entities.Category;
import com.practice.demo.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories(){

        List<CategoryDto> categories = categoryService.listCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(
            @Valid
            @RequestBody CreateCategoryRequest createCategoryRequest){

        return new ResponseEntity<CategoryDto>(
                categoryService.createCategory(createCategoryRequest),
                HttpStatus.CREATED

        );

    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id){
        categoryService.deleteCategory(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

}
