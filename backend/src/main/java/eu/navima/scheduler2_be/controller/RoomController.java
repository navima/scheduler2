package eu.navima.scheduler2_be.controller;

import eu.navima.scheduler2_be.model.RoomData;
import eu.navima.scheduler2_be.model.Status;
import eu.navima.scheduler2_be.model.UserDay;
import eu.navima.scheduler2_be.repository.RoomRepository;
import eu.navima.scheduler2_be.repository.UserDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("room")
@RequiredArgsConstructor
public class RoomController {

	private final RoomRepository roomRepository;
	private final UserDayRepository userDayRepository;

	@GetMapping("/{roomId}")
	private Optional<RoomData> getRoomData(@PathVariable UUID roomId) {
		return roomRepository.findById(roomId);
	}

	@PostMapping
	private UUID makeRoom() {
		return roomRepository.saveAndFlush(new RoomData()).getId();
	}


	@PutMapping("/{roomId}/user/{username}")
	@Transactional
	private void updateRoomUserData(@PathVariable UUID roomId, @PathVariable String username, @RequestBody List<UserDay> data) {
		var toDelete = new ArrayList<UserDay>();
		var toSave = new ArrayList<UserDay>();
		for (UserDay ud : data) {
			if (ud.getStatus() == Status.unknown)
				toDelete.add(ud);
			else {
				var existingOpt = userDayRepository.findByUserData_RoomData_IdAndUserData_Username_AndDate(roomId, username, ud.getDate());
				existingOpt.ifPresentOrElse(existing -> {
							existing.setStatus(ud.getStatus());
							existing.setNote(ud.getNote());
							toSave.add(existing);
						},
						() -> toSave.add(ud));
			}
		}

		userDayRepository.deleteAllByUserData_RoomData_IdAndUserData_Username_AndDateIn(roomId, username, toDelete.stream().map(UserDay::getDate).toList());
		userDayRepository.saveAll(toSave);
	}
}
