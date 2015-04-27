#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.gateway.translator;

import gumga.framework.presentation.GumgaTranslator;

import org.springframework.stereotype.Component;

import ${package}.${parentArtifactId}.domain.model.Coisa;
import ${package}.${parentArtifactId}.gateway.dto.CoisaDTO;

@Component
public class CoisaTranslator extends GumgaTranslator<Coisa, CoisaDTO> {

    @Override
    public Coisa to(CoisaDTO dto) {
        Coisa entidade = new Coisa();

        entidade.setDescricao(dto.getDescricao());
        entidade.setValor(dto.getValor());
        entidade.setAtivo(dto.getAtivo());

        return entidade;
    }

    @Override
    public CoisaDTO from(Coisa entidade) {
        CoisaDTO dto = new CoisaDTO();
        dto.setDescricao(entidade.getDescricao());
        dto.setValor(entidade.getValor());
        dto.setAtivo(entidade.getAtivo());
        return dto;
    }

}
