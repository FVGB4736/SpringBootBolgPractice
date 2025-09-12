package com.practice.demo.domain.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class CreateTagResponse {

    @NotEmpty(message = "At least one tag name is required")
    @Size(max = 10, message = "Maximum {max} tags allowed")
    private Set<
            @Size(min = 2, max = 30, message = "Tag name must between {min} and {max} characters")
            @Pattern(regexp = "^[\\w\\s-]+$", message = "Tag name can only contain letters, numbers, spaces, and hyphens")
            String> names;
}
