package it.pkg.basic.application.service;
import gumga.framework.application.GumgaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pkg.basic.application.repository.CoisaRepository;
import it.pkg.basic.domain.model.Coisa;

@Service
public class CoisaService extends GumgaService<Coisa, Long> {
	
	private CoisaRepository repository;
	
	@Autowired
	public CoisaService(CoisaRepository repository) {
		super(repository);
		this.repository = repository;
	}

}

