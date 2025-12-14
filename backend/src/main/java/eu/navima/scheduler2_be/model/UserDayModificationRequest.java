package eu.navima.scheduler2_be.model;

import lombok.Data;

import java.util.UUID;

@Data
public class UserDayModificationRequest {
	private Type type;
	private UUID id;
	private UserDay data;
	public enum Type {
		remove, add
	}
}
