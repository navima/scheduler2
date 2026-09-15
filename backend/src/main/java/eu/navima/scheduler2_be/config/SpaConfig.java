package eu.navima.scheduler2_be.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class SpaConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**")
				.addResourceLocations("classpath:/static/")
				.resourceChain(true)
				.addResolver(new PathResourceResolver() {
					@Override
					protected Resource getResource(String resourcePath, Resource location) throws IOException {
						if (resourcePath != null && resourcePath.startsWith("api/")) {
							return null;
						}

						if (resourcePath == null || resourcePath.isBlank() || "/".equals(resourcePath)) {
							Resource index = new ClassPathResource("static/index.html");
							if (index.exists()) {
								return index;
							}
						}

						Resource resource = location.createRelative(resourcePath);
						if (resource.exists() && resource.isReadable()) {
							return resource;
						}

						Resource index = new ClassPathResource("static/index.html");
						if (index.exists()) {
							return index;
						}

						return null;
					}
				});
	}
}
