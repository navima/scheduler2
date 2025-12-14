package eu.navima.scheduler2_be.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table
@EntityListeners(AuditingEntityListener.class)
public class RoomData {
	@Id
	@GeneratedValue
	private UUID id;
	@CreatedDate
	private Instant createdAt;
	@LastModifiedDate
	private Instant lastModifiedAt;
	@OneToMany
	private List<UserData> userData;
}
