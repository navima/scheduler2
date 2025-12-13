package eu.navima.scheduler2_be.model;

import lombok.Data;

import java.util.List;

@Data
public class UserData {
	private String username;
	private List<UserDayRange> days;
}
