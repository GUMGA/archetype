#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.gateway;

import org.springframework.stereotype.Component;

import gumga.framework.presentation.GumgaGateway;

@Component
public class CoisaGateway extends GumgaGateway<${package}.${parentArtifactId}.domain.model.Coisa, Long, ${package}.${parentArtifactId}.gateway.dto.CoisaDTO> {

}
