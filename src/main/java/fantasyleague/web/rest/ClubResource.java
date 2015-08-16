package fantasyleague.web.rest;

import com.codahale.metrics.annotation.Timed;
import fantasyleague.domain.Club;
import fantasyleague.repository.ClubRepository;
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
 * REST controller for managing Club.
 */
@RestController
@RequestMapping("/api")
public class ClubResource {

    private final Logger log = LoggerFactory.getLogger(ClubResource.class);

    @Inject
    private ClubRepository clubRepository;

    /**
     * POST  /clubs -> Create a new club.
     */
    @RequestMapping(value = "/clubs",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Club> create(@RequestBody Club club) throws URISyntaxException {
        log.debug("REST request to save Club : {}", club);
        if (club.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new club cannot already have an ID").body(null);
        }
        Club result = clubRepository.save(club);
        return ResponseEntity.created(new URI("/api/clubs/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("club", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /clubs -> Updates an existing club.
     */
    @RequestMapping(value = "/clubs",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Club> update(@RequestBody Club club) throws URISyntaxException {
        log.debug("REST request to update Club : {}", club);
        if (club.getId() == null) {
            return create(club);
        }
        Club result = clubRepository.save(club);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("club", club.getId().toString()))
                .body(result);
    }

    /**
     * GET  /clubs -> get all the clubs.
     */
    @RequestMapping(value = "/clubs",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Club>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<Club> page = clubRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/clubs", offset, limit);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /clubs/:id -> get the "id" club.
     */
    @RequestMapping(value = "/clubs/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Club> get(@PathVariable Long id) {
        log.debug("REST request to get Club : {}", id);
        return Optional.ofNullable(clubRepository.findOne(id))
            .map(club -> new ResponseEntity<>(
                club,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /clubs/:id -> delete the "id" club.
     */
    @RequestMapping(value = "/clubs/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Club : {}", id);
        clubRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("club", id.toString())).build();
    }
}
