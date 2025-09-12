package com.practice.demo.repositories;

import com.practice.demo.domain.PostStatus;
import com.practice.demo.domain.entities.Category;
import com.practice.demo.domain.entities.Post;
import com.practice.demo.domain.entities.Tag;
import com.practice.demo.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    List<Post> findAllByPostStatusAndCategoryAndTagsContaining(PostStatus PostStatus, Category category, Tag tag);

    List<Post> findAllByPostStatusAndCategory(PostStatus PostStatus, Category category);

    List<Post> findAllByPostStatusAndTagsContaining(PostStatus PostStatus, Tag tag);

    List<Post> findAllByPostStatus(PostStatus PostStatus);

    List<Post> findAllByPostStatusAndAuthor(PostStatus PostStatus, User author);
}

