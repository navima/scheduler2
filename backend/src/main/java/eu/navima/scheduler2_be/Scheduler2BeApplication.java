package eu.navima.scheduler2_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableJpaRepositories("eu.navima")
@ComponentScan("eu.navima")
@EnableJpaAuditing
@EnableScheduling
public class Scheduler2BeApplication {

	public static void main(String[] args) {
		SpringApplication.run(Scheduler2BeApplication.class, args);
	}

}
