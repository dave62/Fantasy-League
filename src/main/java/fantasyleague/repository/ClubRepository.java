package fantasyleague.repository;

import fantasyleague.domain.Club;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Club entity.
 */
public interface ClubRepository extends JpaRepository<Club,Long> {

}
