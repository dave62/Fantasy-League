package fantasyleague.web.rest;

import com.codahale.metrics.annotation.Timed;
import fantasyleague.domain.Player;
import fantasyleague.repository.PlayerRepository;
import fantasyleague.web.rest.util.HeaderUtil;
import fantasyleague.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
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
 * REST controller for managing Player.
 */
@RestController
@RequestMapping("/api")
public class PlayerResource {

    private final Logger log = LoggerFactory.getLogger(PlayerResource.class);

    @Inject
    private PlayerRepository playerRepository;

    /**
     * POST  /players -> Create a new player.
     */
    @RequestMapping(value = "/players",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Player> create(@RequestBody Player player) throws URISyntaxException {
        log.debug("REST request to save Player : {}", player);
        if (player.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new player cannot already have an ID").body(null);
        }
        Player result = playerRepository.save(player);
        return ResponseEntity.created(new URI("/api/players/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("player", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /players -> Updates an existing player.
     */
    @RequestMapping(value = "/players",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Player> update(@RequestBody Player player) throws URISyntaxException {
        log.debug("REST request to update Player : {}", player);
        if (player.getId() == null) {
            return create(player);
        }
        Player result = playerRepository.save(player);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("player", player.getId().toString()))
                .body(result);
    }

    /**
     * GET  /players -> get all the players.
     */
    @RequestMapping(value = "/players",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Player>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit) throws URISyntaxException {
    	
    	if (offset != null) {
    		Page<Player> page = playerRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
    		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/players", offset, limit);
    		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    	} else {
    		List<Player> players = playerRepository.findAll();
    		return new ResponseEntity<List<Player>>(players, HttpStatus.OK);
    	}
    }

    /**
     * GET  /players/:id -> get the "id" player.
     */
    @RequestMapping(value = "/players/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Player> get(@PathVariable Long id) {
        log.debug("REST request to get Player : {}", id);
        return Optional.ofNullable(playerRepository.findOne(id))
            .map(player -> new ResponseEntity<>(
                player,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /players/:id -> delete the "id" player.
     */
    @RequestMapping(value = "/players/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Player : {}", id);
        playerRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("player", id.toString())).build();
    }
}
