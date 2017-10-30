#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.configuration.application;

import io.gumga.core.GumgaValues;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Properties;


@Component
public class ApplicationConstants implements GumgaValues {

    private static final String DEFAULT_SECURITY_URL = "https://gumga.io";
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationConstants.class);
    private Properties properties;

    public ApplicationConstants() {
        this.properties = getCustomFileProperties();
    }

    @Override
    public String getGumgaSecurityUrl() {
        String security =  this.properties.getProperty("url.host", DEFAULT_SECURITY_URL).concat("/security-api/publicoperations");
        LOGGER.info("Security: " + security);
        return security;
    }

    @Override
    public boolean isLogActive() {
        Boolean active = Boolean.valueOf(properties.getProperty("gumgalog.ativo", "true"));
        LOGGER.info("Log Active: " + active);
        return active;
    }


    @Override
    public String getCustomPropertiesFileName() {
        return "${parentArtifactId}.properties";
    }

    @Override
    public String getGumgaNLPBasePackage() {
        return "${package}.${parentArtifactId}.domain";
    }


    @Override
    public String getSoftwareName() {
        return "${package}.${parentArtifactId}";
    }
}
