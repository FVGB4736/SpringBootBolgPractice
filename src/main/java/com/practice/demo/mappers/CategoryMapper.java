package com.practice.demo.mappers;

import com.practice.demo.domain.PostStatus;
import com.practice.demo.domain.dtos.CategoryDto;
import com.practice.demo.domain.dtos.CreateCategoryRequest;
import com.practice.demo.domain.entities.Category;
import com.practice.demo.domain.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import java.util.List;

// 定義 MapStruct 映射介面，將 Category 轉為 CategoryDto
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
// @Mapper: 標記這是 MapStruct 映射介面，生成將 Category 轉為 CategoryDto 的程式碼
// componentModel = "spring": 生成 Spring Bean，可用 @Autowired 注入到 Spring 專案
// unmappedTargetPolicy = ReportingPolicy.IGNORE: 忽略 CategoryDto 中未對應的屬性，不報錯
public interface CategoryMapper {

    // 將 Category 轉為 CategoryDto
    @Mapping(target = "postCount", source = "posts", qualifiedByName = "calculatePostCount")
    // @Mapping: 指定映射規則
    // target = "postCount": 目標是 CategoryDto 的 postCount 屬性
    // source = "posts": 來源是 Category 的 posts 集合（List<Post>）
    // qualifiedByName = "calculatePostCount": 使用名為 calculatePostCount 的方法計算 postCount
    CategoryDto toDto(Category category);

    // 自訂方法，計算已發布貼文數量
    @Named("calculatePostCount")
    // @Named("calculatePostCount"): 標記此方法為 MapStruct 的自訂映射方法，供 @Mapping 引用
    default long calculatePostCount(List<Post> posts) {
        if (null == posts) {
            return 0;
        }
        // 過濾狀態為 PUBLISHED 的貼文並計數
        return posts.stream().filter(post -> PostStatus.PUBLISHED.equals(post.getPostStatus())).count();
    }

    Category toEntity(CreateCategoryRequest createCategoryRequest);
}