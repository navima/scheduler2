package eu.navima.scheduler2_be.repository;

import eu.navima.scheduler2_be.model.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, UUID> {
	Optional<UserData> findByUsernameAndRoomData_Id(String username, UUID id);
}
