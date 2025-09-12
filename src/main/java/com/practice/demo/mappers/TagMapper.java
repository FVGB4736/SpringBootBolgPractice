package com.practice.demo.mappers;

import com.practice.demo.domain.PostStatus;
import com.practice.demo.domain.dtos.TagDto;
import com.practice.demo.domain.entities.Post;
import com.practice.demo.domain.entities.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TagMapper {

    @Mapping(target = "postCount", source = "posts", qualifiedByName = "calculatePostCount")
    TagDto toTagResponse(Tag tag);

    @Named("calculatePostCount")
    default Long calculatePostCount(Set<Post> posts){
        if(posts == null){
            return 0L;
        }

        return posts.stream().filter(post -> PostStatus.PUBLISHED.equals(post.getPostStatus())).count();
    }

}
