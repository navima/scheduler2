package eu.navima.scheduler2_be.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Entity
public class UserData {
	@Id
	@GeneratedValue
	private UUID id;
	private String username;
	@OneToMany
	private List<UserDay> days;
	@ManyToOne
	private RoomData roomData;
}
