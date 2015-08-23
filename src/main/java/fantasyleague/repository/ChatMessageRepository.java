package fantasyleague.repository;

import fantasyleague.domain.ChatMessage;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the ChatMessage entity.
 */
public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {

    @Query("select chatMessage from ChatMessage chatMessage where chatMessage.author.login = ?#{principal.username}")
    List<ChatMessage> findAllForCurrentUser();

}
