package com.practice.demo.repositories;

import com.practice.demo.domain.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

    @Query("SELECT t FROM Tag t LEFT JOIN t.posts")
    List<Tag> finaAllWithPostCount();

    List<Tag> findByNameIn(Set<String> names);
}
