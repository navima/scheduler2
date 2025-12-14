package eu.navima.scheduler2_be.repository;

import eu.navima.scheduler2_be.model.UserDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserDayRepository extends JpaRepository<UserDay, UUID> {
}
