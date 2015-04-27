#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.application.service;
import gumga.framework.application.GumgaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ${package}.${parentArtifactId}.application.repository.CoisaRepository;
import ${package}.${parentArtifactId}.domain.model.Coisa;

@Service
public class CoisaService extends GumgaService<Coisa, Long> {
	
	private CoisaRepository repository;
	
	@Autowired
	public CoisaService(CoisaRepository repository) {
		super(repository);
		this.repository = repository;
	}

}

