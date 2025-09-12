package com.practice.demo.domain.dtos;

import com.practice.demo.domain.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostRequestDto {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between {min} to {max} characters")
    private String title;

    @NotBlank(message = "Content is required")
    @Size(min = 3, max = 50000, message = "Content must be between {min} to {max} characters")
    private String content;

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    //確保 Builder 模式在創建物件時，保留類別中屬性的預設值。@Builder.Default保證 tagsId 在使用 Builder 創建物件時，預設是一個空的 HashSet<UUID>，而不是 null
    @Builder.Default
    @Size(max = 10, message = "Maximun {max} tags allowed")
    private Set<UUID> tagsId = new HashSet<>();

    @NotNull(message = "Status is required")
    private PostStatus status;

}
