#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.infrastructure.config;

import gumga.framework.core.GumgaValues;
import org.springframework.stereotype.Component;

@Component
public class ApplicationConstants implements GumgaValues {

    @Override
    public String getGumgaSecurityUrl() {
        return "http://www.gumga.com.br/gumgasecurity-presentation-0.1";
    }

    @Override
    public boolean isLogActive() {
        return true;
    }

}
