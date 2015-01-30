#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.application.repository;

import gumga.framework.domain.repository.GumgaCrudRepository;
import ${package}.${parentArtifactId}.domain.model.Coisa;

public interface CoisaRepository extends GumgaCrudRepository<Coisa, Long> {

}

