package com.practice.demo.services;

import com.practice.demo.domain.dtos.TagDto;
import com.practice.demo.domain.entities.Tag;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagService {

    List<TagDto> getTags();

    List<TagDto> createTags(Set<String> tagNames);

    void deleteTag(UUID id);

    Tag getTagById(UUID id);

    List<Tag> getTagsByIds(Set<UUID> ids);


}
