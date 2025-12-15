package eu.navima.scheduler2_be.service;

import eu.navima.scheduler2_be.model.RoomData;
import eu.navima.scheduler2_be.model.Status;
import eu.navima.scheduler2_be.model.UserData;
import eu.navima.scheduler2_be.model.UserDay;
import eu.navima.scheduler2_be.repository.RoomRepository;
import eu.navima.scheduler2_be.repository.UserDataRepository;
import eu.navima.scheduler2_be.repository.UserDayRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

	private final RoomRepository roomRepository;
	private final UserDayRepository userDayRepository;
	private final UserDataRepository userDataRepository;

	@Transactional
	public void updateRoomUserData(UUID roomId, String username, List<UserDay> data) {
		var roomData = roomRepository.findById(roomId).get();
		var userData = userDataRepository.findByUsernameAndRoomData_Id(username, roomId)
				.orElseGet(() -> saveNewUserData(username, roomData));
		var toDelete = new ArrayList<UserDay>();
		var toSave = new ArrayList<UserDay>();
		for (UserDay userDay : data) {
			if (userDay.getStatus() == Status.unknown) {
				userDay.setUserData(userData);
				toDelete.add(userDay);
			} else {
				var existingOpt = userDayRepository.findByUserData_RoomData_IdAndUserData_Username_AndDate(roomId, username, userDay.getDate());
				existingOpt.ifPresentOrElse(existing -> {
							existing.setStatus(userDay.getStatus());
							existing.setNote(userDay.getNote());
							existing.setUserData(userData);
							userData.getDays().removeIf(existingDay -> existingDay.getDate().equals(userDay.getDate()));
							toSave.add(existing);
						},
						() -> {
							userDay.setUserData(userData);
							toSave.add(userDay);
						});
			}
		}

		userDayRepository.deleteAllByUserData_RoomData_IdAndUserData_Username_AndDateIn(roomId, username, toDelete.stream().map(UserDay::getDate).toList());
		userDayRepository.saveAll(toSave);
		userData.getDays().addAll(toSave);
		userDataRepository.save(userData);
	}

	private @NonNull UserData saveNewUserData(String username, RoomData roomData) {
		var newUserData = new UserData();
		newUserData.setUsername(username);
		newUserData.setRoomData(roomData);
		newUserData.setDays(new ArrayList<>());
		var saved = userDataRepository.save(newUserData);
		roomData.getUserData().add(saved);
		roomRepository.save(roomData);
		return saved;
	}


}
