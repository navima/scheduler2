package eu.navima.scheduler2_be.model;

import jakarta.annotation.Nullable;
import lombok.Data;

@Data
public class CreateRoomRequest {
    @Nullable
    private String name;
}