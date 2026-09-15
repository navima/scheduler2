package eu.navima.scheduler2_be.service;

import eu.navima.scheduler2_be.model.RoomData;
import eu.navima.scheduler2_be.model.Status;
import eu.navima.scheduler2_be.model.UserData;
import eu.navima.scheduler2_be.model.UserDay;
import eu.navima.scheduler2_be.model.UserDayUpdateRequest;
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
	public void updateRoomUserData(UUID roomId, String username, List<UserDayUpdateRequest> reqs) {
		var userData = userDataRepository.findByUsernameAndRoomData_Id(username, roomId)
				.orElseGet(() -> saveNewUserData(username, roomRepository.findById(roomId).get()));
		var toDeleteDates = new ArrayList<String>();
		var toSaveReq = new ArrayList<UserDayUpdateRequest>();
		var toSaveUserDays = new ArrayList<UserDay>();
		for (var req : reqs) {
			if (req.getStatus() == Status.unknown) {
				toDeleteDates.add(req.getDate());
			} else {
				toSaveReq.add(req);
			}
		}
		userDayRepository.deleteAllByUserData_RoomData_IdAndUserData_Username_AndDateIn(roomId, username, toDeleteDates);

		for (var req : toSaveReq) {
			var existingOpt = userDayRepository.findByUserData_RoomData_IdAndUserData_Username_AndDate(roomId, username, req.getDate());
			existingOpt.ifPresentOrElse(existing -> {
				existing.setStatus(req.getStatus());
				existing.setNote(req.getNote());
				existing.setUserData(userData);
				//userData.getDays().removeIf(existingDay -> existingDay.getDate().equals(req.getDate()));
				toSaveUserDays.add(existing);
			}, () -> {
				var userDay = new UserDay();
				userDay.setDate(req.getDate());
				userDay.setStatus(req.getStatus());
				userDay.setUserData(userData);
				toSaveUserDays.add(userDay);
			});
		}

		userDayRepository.saveAll(toSaveUserDays);
		userData.getDays().addAll(toSaveUserDays);
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
