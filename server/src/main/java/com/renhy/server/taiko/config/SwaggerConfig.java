package com.renhy.server.taiko.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.paths.RelativePathProvider;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.ServletContext;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableSwagger2
public class SwaggerConfig {


    @Value("${sys.version}")
    private String version;

    @Value("${swagger.enable}")
    private boolean enable;

    @Value("${swagger.base-url}")
    private String baseUrl = "";

    @Value("${swagger.host}")
    private String host = "";


    @Bean
    public Docket createRestApi(ServletContext servletContext) {
        return new Docket(DocumentationType.SWAGGER_2)

                .pathProvider(new RelativePathProvider(servletContext) {
                    @Override
                    public String getApplicationBasePath() {
                        return baseUrl + super.getApplicationBasePath();
                    }

                })
                .enable(enable)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.renhy.server.taiko"))
                .paths(PathSelectors.any())
                .build()
                .securitySchemes(token())
                .securityContexts(contexts());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Taiko Ground Server APIs")
                .description("")
                .termsOfServiceUrl("")
                .version(version)
                .build();
    }

    private List<ApiKey> token() {
        List<ApiKey> keys = new ArrayList<>();
        keys.add(new ApiKey("Authorization", "Authorization", "header"));
        return keys;
    }

    private List<SecurityContext> contexts() {
        List<SecurityContext> contexts = new ArrayList<>();
        contexts.add(SecurityContext.builder()
                .securityReferences(auth())
                .forPaths(PathSelectors.any())
                .build());
        return contexts;
    }

    private List<SecurityReference> auth() {
        List<SecurityReference> auths = new ArrayList<>();
        auths.add(new SecurityReference("Authorization", new AuthorizationScope[0]));
        return auths;
    }





}
