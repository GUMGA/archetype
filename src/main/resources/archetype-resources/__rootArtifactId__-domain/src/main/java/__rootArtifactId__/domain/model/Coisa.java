#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.domain.model;

import gumga.framework.domain.GumgaModel;
import gumga.framework.domain.GumgaMultitenancy;
import java.io.Serializable;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.envers.Audited;

@Audited
@GumgaMultitenancy
@Entity
@SequenceGenerator(name = GumgaModel.SEQ_NAME, sequenceName = "SEQ_COISA")
public class Coisa extends GumgaModel<Long> implements Serializable {

    @NotNull
    @NotEmpty
    @Size(min = 2)
    private String descricao;
    private BigDecimal valor;
    private boolean ativo;

    public Coisa() {
    }

    public Coisa(String descricao, BigDecimal valor, boolean ativo) {
        this.descricao = descricao;
        this.valor = valor;
        this.ativo = ativo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

}
