package pl.zgora.jug.sprangu;

import static org.fest.assertions.Assertions.assertThat;

import java.math.BigDecimal;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@Transactional
public class CarRepositoryTest {
	@Inject
	CarRepository repo;

	@Test
	public void shouldAddCar() throws Exception {
		// given
		Car car = new Car();
		car.setName("Audi");
		car.setPrice(new BigDecimal("123.99"));

		long currentCount = repo.count();

		// when
		repo.save(car);

		// then
		assertThat(repo.count()).isEqualTo(currentCount + 1);
	}

	@Test
	public void shouldFindCarByName() throws Exception {
		// given
		String carName = "Audi";
		Car car = createCar(carName);
		repo.save(car);

		// when
		Car findedCar = repo.findBy(carName);

		// then
		assertThat(findedCar).isNotNull();
	}

	private Car createCar(String carName) {
		Car car = new Car();
		car.setName(carName);
		car.setPrice(new BigDecimal("123.99"));
		car.setProductionYear(1999);
		return car;
	}

}
