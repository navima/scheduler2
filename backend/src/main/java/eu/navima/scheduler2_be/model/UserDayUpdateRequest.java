package eu.navima.scheduler2_be.model;

import lombok.Data;

@Data 
public class UserDayUpdateRequest {
    private String date;
    private Status status;
    private String note;
}
