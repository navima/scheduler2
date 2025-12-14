package eu.navima.scheduler2_be.repository;

import eu.navima.scheduler2_be.model.RoomData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<RoomData, UUID> {
}
