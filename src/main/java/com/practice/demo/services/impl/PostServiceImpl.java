package com.practice.demo.services.impl;

import com.practice.demo.domain.PostStatus;
import com.practice.demo.domain.dtos.CreatePostRequestDto;
import com.practice.demo.domain.dtos.PostDto;
import com.practice.demo.domain.dtos.UpdatePostRequestDto;
import com.practice.demo.domain.entities.Category;
import com.practice.demo.domain.entities.Post;
import com.practice.demo.domain.entities.Tag;
import com.practice.demo.domain.entities.User;
import com.practice.demo.mappers.PostMapper;
import com.practice.demo.repositories.PostRepository;
import com.practice.demo.services.CategoryService;
import com.practice.demo.services.PostService;
import com.practice.demo.services.TagService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;

    private final PostMapper postMapper;

    private final static Integer WORDS_PER_MINUTE = 200;


    @Override
    @Transactional(readOnly = true)
    public List<PostDto> getAllPosts(UUID categoryId, UUID tagId) {

        List<Post> posts = new ArrayList<>();

        if(categoryId != null && tagId!= null){
            Category category = categoryService.getCategoryById(categoryId);
            Tag tag = tagService.getTagById(tagId);
            posts = postRepository.findAllByPostStatusAndCategoryAndTagsContaining(
                    PostStatus.PUBLISHED,
                    category,
                    tag
            );

        }

        if(categoryId != null){
            Category category = categoryService.getCategoryById(categoryId);
            posts = postRepository.findAllByPostStatusAndCategory(
                    PostStatus.PUBLISHED,
                    category
            );
        }

        if(tagId != null){
            Tag tag = tagService.getTagById(tagId);
            posts = postRepository.findAllByPostStatusAndTagsContaining(
                    PostStatus.PUBLISHED,
                    tag
            );
        }


        posts = postRepository.findAllByPostStatus(PostStatus.PUBLISHED);

        return posts.stream().map(postMapper :: toDto).toList();

    }

    @Override
    public List<PostDto> getDraftPosts(User user) {
        List<Post> posts = postRepository.findAllByPostStatusAndAuthor(PostStatus.DRAFT, user);

        return posts.stream().map(postMapper :: toDto).toList();
    }

    @Override
    @Transactional
    public PostDto createPost(User user, CreatePostRequestDto createPostRequestDto) {
        Post newPost = new Post();
        newPost.setTitle(createPostRequestDto.getTitle());
        newPost.setContent(createPostRequestDto.getContent());
        newPost.setAuthor(user);
        newPost.setPostStatus(createPostRequestDto.getStatus());
        newPost.setReadingTime(this.calculateReadingTime(createPostRequestDto.getContent()));

        Category category = categoryService.getCategoryById(createPostRequestDto.getCategoryId());
        newPost.setCategory(category);

        Set<UUID> tagIds = createPostRequestDto.getTagsId();
        List<Tag> tags = tagService.getTagsByIds(tagIds);
        newPost.setTags(new HashSet<>(tags));

        Post savedPost =  postRepository.save(newPost);

        return postMapper.toDto(savedPost);

    }



    private Integer calculateReadingTime(String content){
        if(content == null || content.isEmpty()){
            return 0;
        }

        int wordCount = content.trim().split("\\s+").length;

        return wordCount/WORDS_PER_MINUTE;

    }

    @Override
    @Transactional
    public PostDto updatePost(UUID id, UpdatePostRequestDto updatePostRequestDto) {

        Post existingPost = postRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Post not found with ID "+id));

        existingPost.setTitle(updatePostRequestDto.getTitle());
        existingPost.setContent(updatePostRequestDto.getContent());
        existingPost.setPostStatus(updatePostRequestDto.getStatus());
        existingPost.setReadingTime(this.calculateReadingTime(updatePostRequestDto.getContent()));

        Category oldCategory = existingPost.getCategory();

        if(!existingPost.getCategory().equals(oldCategory)){
            Category newCategory = categoryService.getCategoryById(updatePostRequestDto.getCategoryId());
            existingPost.setCategory(newCategory);
        }

        Set<UUID> existingTagIds = existingPost.getTags().stream().map(Tag::getId).collect(Collectors.toSet());
        Set<UUID> newTagIds = updatePostRequestDto.getTagsIds();
        if(!existingTagIds.equals(newTagIds)){
            List<Tag> newTags = tagService.getTagsByIds(newTagIds);
            existingPost.setTags(new HashSet<>(newTags));
        }

        Post savedPost = postRepository.save(existingPost);

        return postMapper.toDto(savedPost);
       
        
    }

    @Override
    public PostDto getPost(UUID id) {
        Post post = postRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Post not found with ID "+id));

        return postMapper.toDto(post);
        
    }

    @Override
    public void deletePost(UUID id) {
        Post post = postRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Post not found with ID "+id));

        postRepository.delete(post);
    }
}
