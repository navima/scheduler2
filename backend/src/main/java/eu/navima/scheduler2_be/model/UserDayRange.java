package eu.navima.scheduler2_be.model;

import jakarta.annotation.Nullable;
import lombok.Data;

@Data
public class UserDayRange {
	private String date;
	private Status status;
	@Nullable
	private String note;
}
