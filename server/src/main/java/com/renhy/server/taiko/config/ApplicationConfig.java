package com.renhy.server.taiko.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import javax.servlet.MultipartConfigElement;

@Configuration
public class ApplicationConfig {


    @Value("${upload.maxSize}")
    private String maxSize;

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        DataSize size = DataSize.parse(maxSize);
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(size);
        factory.setMaxRequestSize(size);
        return factory.createMultipartConfig();
    }

}
