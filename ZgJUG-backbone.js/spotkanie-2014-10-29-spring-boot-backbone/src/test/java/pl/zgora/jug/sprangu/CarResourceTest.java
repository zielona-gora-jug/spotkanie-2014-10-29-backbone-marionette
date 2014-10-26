package pl.zgora.jug.sprangu;

import static org.fest.assertions.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

import javax.inject.Inject;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@Transactional
@WebAppConfiguration
@IntegrationTest("server.port=0")
public class CarResourceTest {

	@Inject
	CarRepository repo;

	@Inject
	CarResource carResource;

	private MockMvc resourceMockMvc;

	@Before
	public void setup() {
		this.resourceMockMvc = MockMvcBuilders.standaloneSetup(carResource).build();
	}

	@Value("${local.server.port}")
	int port;

	@Test
	public void shouldRetrunAllCars() throws Exception {
		// given
		Car car = new Car();
		car.setName("Audi");
		car.setPrice(new BigDecimal("123.99"));
		car.setProductionYear(2000);
		repo.save(car);

		// when
		MvcResult result = resourceMockMvc.perform(get("/cars")).andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andReturn();

		// then
		assertThat(result.getResponse().getContentAsString()).contains("Audi");
	}
}
