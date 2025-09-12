package com.practice.demo.repositories;

import com.practice.demo.domain.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {


    //此SQL解決N+1 問題：如果不使用 FETCH，查詢所有 Category 後，訪問每個 c.getPosts() 會單獨觸發一次 SQL 查詢。
    //如果有 N 個 Category，會產生 N+1 次查詢（1 次查 categories，N 次查每個人的 posts）。
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.posts")
    List<Category> findAllWithPostCount();

    boolean existsByNameIgnoreCase(String name);
}
