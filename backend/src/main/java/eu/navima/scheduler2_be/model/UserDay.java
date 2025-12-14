package eu.navima.scheduler2_be.model;

import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class UserDay {
	@Id
	@GeneratedValue
	private UUID id;
	private String date;
	private Status status;
	@Nullable
	private String note;
	@ManyToOne
	private UserData userData;
}
