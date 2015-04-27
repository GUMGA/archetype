package it.pkg.basic.gateway;

import org.springframework.stereotype.Component;

import gumga.framework.presentation.GumgaGateway;

@Component
public class CoisaGateway extends GumgaGateway<it.pkg.basic.domain.model.Coisa, Long, it.pkg.basic.gateway.dto.CoisaDTO> {

}
