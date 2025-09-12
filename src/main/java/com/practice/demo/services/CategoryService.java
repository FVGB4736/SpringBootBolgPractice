package com.practice.demo.services;

import com.practice.demo.domain.dtos.CategoryDto;
import com.practice.demo.domain.dtos.CreateCategoryRequest;
import com.practice.demo.domain.entities.Category;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

public interface CategoryService {

    List<CategoryDto> listCategories();

    CategoryDto createCategory(@Valid CreateCategoryRequest createCategoryRequest);

    void deleteCategory(UUID id);

    Category getCategoryById(UUID id);
}
