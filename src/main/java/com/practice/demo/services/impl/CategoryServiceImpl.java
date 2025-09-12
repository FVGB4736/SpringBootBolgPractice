package com.practice.demo.services.impl;

import com.practice.demo.domain.dtos.CategoryDto;
import com.practice.demo.domain.dtos.CreateCategoryRequest;
import com.practice.demo.domain.entities.Category;
import com.practice.demo.mappers.CategoryMapper;
import com.practice.demo.repositories.CategoryRepository;
import com.practice.demo.services.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryDto> listCategories() {

        List<Category> categories = categoryRepository.findAllWithPostCount();


        return categories.stream().map(categoryMapper :: toDto).toList();
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CreateCategoryRequest createCategoryRequest) {

        Category categoryToCreate = categoryMapper.toEntity(createCategoryRequest);

        if(categoryRepository.existsByNameIgnoreCase(categoryToCreate.getName())){
            throw new IllegalArgumentException("Category already exist with name " + categoryToCreate.getName());
        }
        return categoryMapper.toDto(categoryRepository.save(categoryToCreate));
    }

    @Override
    public void deleteCategory(UUID id) {
        Optional<Category> category = categoryRepository.findById(id);

        if(category.isPresent() && category.get().getPosts().size() > 0){
            throw new IllegalArgumentException("Category has posts associated with it");
        }

        categoryRepository.deleteById(id);


    }

    @Override
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("Category not found with id " + id));
    }


}
