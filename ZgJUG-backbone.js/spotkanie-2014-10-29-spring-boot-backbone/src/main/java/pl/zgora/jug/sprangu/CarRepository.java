package pl.zgora.jug.sprangu;

import java.math.BigDecimal;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CarRepository extends JpaRepository<Car, Long> {

	Car findByName(String carName);

	List<Car> findByNameContainingIgnoringCase(String query);

	@Query(value = "SELECT c FROM Car c where c.name = :name")
	Car findBy(@Param("name") String name);

	@Modifying
	@Transactional
	@Query(value = "UPDATE Car c SET c.name = :name, c.productionYear = :productionYear, c.price = :price where c.id = :id")
	int update(@Param("id") Long id, @Param("name") String name, @Param("productionYear") Integer productionYear, @Param("price") BigDecimal price);
}
