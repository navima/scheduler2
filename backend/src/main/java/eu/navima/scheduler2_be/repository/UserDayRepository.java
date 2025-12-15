package eu.navima.scheduler2_be.repository;

import eu.navima.scheduler2_be.model.UserDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserDayRepository extends JpaRepository<UserDay, UUID> {
	Optional<UserDay> findByUserData_RoomData_IdAndUserData_Username_AndDate(UUID roomId, String username, String date);

	void deleteAllByUserData_RoomData_IdAndUserData_Username_AndDateIn(UUID roomId, String username, List<String> dates);
}
