package pl.zgora.jug.sprangu;

import java.math.BigDecimal;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.web.WebAppConfiguration;

@ComponentScan
@EnableAutoConfiguration
@WebAppConfiguration
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Inject
	CarRepository repo;

	@PostConstruct
	public void init() {
		Car ford = new Car();
		ford.setName("Ford Focus");
		ford.setPrice(new BigDecimal("54000"));
		ford.setProductionYear(2014);
		repo.save(ford);

		Car honda = new Car();
		honda.setName("Honda Accord");
		honda.setPrice(new BigDecimal("72000"));
		honda.setProductionYear(2014);
		repo.save(honda);
	}
}
