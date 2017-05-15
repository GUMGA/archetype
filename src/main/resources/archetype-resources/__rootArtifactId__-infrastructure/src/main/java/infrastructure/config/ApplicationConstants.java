#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.infrastructure.config;

import io.gumga.core.GumgaValues;
import org.springframework.stereotype.Component;
import java.util.Properties;

@Component
public class ApplicationConstants implements GumgaValues {

    private static final String DEFAULT_SECURITY_URL = "http://localhost";
    private Properties properties;

    public ApplicationConstants() {
        this.properties = getCustomFileProperties();
    }

    @Override
    public String getGumgaSecurityUrl() {
        return this.properties.getProperty("url.host", DEFAULT_SECURITY_URL).concat("/security-api/publicoperations");
    }

    @Override
    public boolean isLogActive() {
        return Boolean.valueOf(this.properties.getProperty("gumgalog.ativo", "true"));
    }

    @Override
    public String getCustomPropertiesFileName() {
        return "${parentArtifactId}.properties";
    }

    @Override
    public String getSoftwareName() {
        return "${package}.${parentArtifactId}";
    }

}
