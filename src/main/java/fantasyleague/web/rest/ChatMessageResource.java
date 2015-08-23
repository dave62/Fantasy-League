package fantasyleague.web.rest;

import com.codahale.metrics.annotation.Timed;
import fantasyleague.domain.ChatMessage;
import fantasyleague.repository.ChatMessageRepository;
import fantasyleague.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ChatMessage.
 */
@RestController
@RequestMapping("/api")
public class ChatMessageResource {

    private final Logger log = LoggerFactory.getLogger(ChatMessageResource.class);

    @Inject
    private ChatMessageRepository chatMessageRepository;

    /**
     * POST  /chatMessages -> Create a new chatMessage.
     */
    @RequestMapping(value = "/chatMessages",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ChatMessage> create(@RequestBody ChatMessage chatMessage) throws URISyntaxException {
        log.debug("REST request to save ChatMessage : {}", chatMessage);
        if (chatMessage.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new chatMessage cannot already have an ID").body(null);
        }
        ChatMessage result = chatMessageRepository.save(chatMessage);
        return ResponseEntity.created(new URI("/api/chatMessages/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("chatMessage", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /chatMessages -> Updates an existing chatMessage.
     */
    @RequestMapping(value = "/chatMessages",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ChatMessage> update(@RequestBody ChatMessage chatMessage) throws URISyntaxException {
        log.debug("REST request to update ChatMessage : {}", chatMessage);
        if (chatMessage.getId() == null) {
            return create(chatMessage);
        }
        ChatMessage result = chatMessageRepository.save(chatMessage);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("chatMessage", chatMessage.getId().toString()))
                .body(result);
    }

    /**
     * GET  /chatMessages -> get all the chatMessages.
     */
    @RequestMapping(value = "/chatMessages",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<ChatMessage> getAll() {
        log.debug("REST request to get all ChatMessages");
        return chatMessageRepository.findAll();
    }

    /**
     * GET  /chatMessages/:id -> get the "id" chatMessage.
     */
    @RequestMapping(value = "/chatMessages/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ChatMessage> get(@PathVariable Long id) {
        log.debug("REST request to get ChatMessage : {}", id);
        return Optional.ofNullable(chatMessageRepository.findOne(id))
            .map(chatMessage -> new ResponseEntity<>(
                chatMessage,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /chatMessages/:id -> delete the "id" chatMessage.
     */
    @RequestMapping(value = "/chatMessages/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete ChatMessage : {}", id);
        chatMessageRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("chatMessage", id.toString())).build();
    }
}
