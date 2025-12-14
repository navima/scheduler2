package eu.navima.scheduler2_be.controller;

import eu.navima.scheduler2_be.model.UserDayModificationRequest;
import eu.navima.scheduler2_be.repository.RoomRepository;
import eu.navima.scheduler2_be.repository.UserDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("day")
@RequiredArgsConstructor
public class UserDayController {

	private final RoomRepository roomRepository;
	private final UserDayRepository userDayRepository;

	@PutMapping("/{roomId}/user/{username}")
	private void updateRoomUserData(@PathVariable UUID roomId, @PathVariable String username, @RequestBody List<UserDayModificationRequest> batchReq) {
		// validation
		var room = roomRepository.findById(roomId).get();
		var user = room.getUserData().stream().filter(data -> username.equals(data.getUsername())).findAny().get();

		// processing
		var categorized = batchReq.stream().collect(Collectors.groupingBy(UserDayModificationRequest::getType));

		var toRemoveIds = categorized.get(UserDayModificationRequest.Type.remove).stream().map(UserDayModificationRequest::getId).toList();
		if (!toRemoveIds.isEmpty())
			userDayRepository.deleteAllByIdInBatch(toRemoveIds);

		var toAddIds = categorized.get(UserDayModificationRequest.Type.add).stream().map(UserDayModificationRequest::getData).toList();
		if (!toAddIds.isEmpty())
			userDayRepository.saveAll(toAddIds);
	}
}
