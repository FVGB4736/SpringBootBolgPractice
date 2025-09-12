package com.practice.demo.services.impl;

import com.practice.demo.domain.dtos.TagDto;
import com.practice.demo.domain.entities.Tag;
import com.practice.demo.mappers.TagMapper;
import com.practice.demo.repositories.TagRepository;
import com.practice.demo.services.TagService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    private final TagMapper tagMapper;


    @Override
    public List<TagDto> getTags() {

        List<Tag> tags = tagRepository.finaAllWithPostCount();

        return tags.stream().map(tagMapper :: toTagResponse).toList();
    }

    @Transactional
    @Override
    public List<TagDto> createTags(Set<String> tagNames) {

        List<Tag> existingTags = tagRepository.findByNameIn(tagNames);

        Set<String> existingTagNames = existingTags
                .stream()
                .map(Tag :: getName)
                .collect(Collectors.toSet());

        List<Tag> newTags = tagNames
                .stream()
                .filter(name -> !existingTagNames.contains(name))
                .map(name -> Tag.builder()
                        .name(name)
                        .posts(new HashSet<>())
                        .build()

                )
                .toList();

        List<Tag> savedTags = new ArrayList<>();
        if(!newTags.isEmpty()){
            savedTags = tagRepository.saveAll(newTags);
        }

        savedTags.addAll(existingTags);

        List<TagDto> resultList = savedTags
                .stream()
                .map(tag -> tagMapper.toTagResponse(tag))
                .toList();

        return resultList;
    }

    @Transactional
    @Override
    public void deleteTag(UUID id) {
        Optional<Tag> tag = tagRepository.findById(id);

        if(tag.isEmpty()){
            //throw new IllegalArgumentException("Tag with this name does not exist!");
            return;
        }

        if(tag.get().getPosts().isEmpty()){
            throw new IllegalArgumentException("Can not delete tag with posts");
        }

        tagRepository.deleteById(id);

    }

    @Override
    public Tag getTagById(UUID id) {
        return tagRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("Tag not found with id " + id));
    }

    @Override
    public List<Tag> getTagsByIds(Set<UUID> ids) {

        List<Tag> foundTags = tagRepository.findAllById(ids);
        if(foundTags.size() != ids.size()){
            throw new EntityNotFoundException("Not all specified tag IDs exist");
        }

        return foundTags;
    }
}
