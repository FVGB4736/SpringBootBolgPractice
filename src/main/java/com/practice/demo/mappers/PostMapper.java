package com.practice.demo.mappers;

import com.practice.demo.domain.dtos.CreatePostRequestDto;
import com.practice.demo.domain.dtos.PostDto;
import com.practice.demo.domain.dtos.UpdatePostRequestDto;
import com.practice.demo.domain.entities.CreatePostRequest;
import com.practice.demo.domain.entities.Post;
import com.practice.demo.domain.entities.UpdatePostRequest;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {


    @Mapping(target = "author", source = "author")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "tags", source = "tags")
    //如果不加這三個 @Mapping 註解（author、category、tags），MapStruct 會因為類型不一致（User vs AuthorDto、Category vs CategoryDto、Set<Tag> vs Set<TagDto>）而在編譯時報錯。
    //此外，必須先建立好AuthorMapper, CategoryMapper, TagMapper，讓 MapStruct 知道如何做轉換
    PostDto toDto(Post post);

    CreatePostRequest toCreeatePostRequest(CreatePostRequestDto dto);

    UpdatePostRequest toUpdatePostRequest(UpdatePostRequestDto dto);

}
