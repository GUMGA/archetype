#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.api;

import ${package}.${parentArtifactId}.domain.model.Coisa;
import gumga.framework.application.GumgaService;
import gumga.framework.presentation.GumgaAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coisa")
public class CoisaAPI extends GumgaAPI<Coisa, Long> {

    @Autowired
    public CoisaAPI(GumgaService<Coisa, Long> service) {
        super(service);
    }

}
