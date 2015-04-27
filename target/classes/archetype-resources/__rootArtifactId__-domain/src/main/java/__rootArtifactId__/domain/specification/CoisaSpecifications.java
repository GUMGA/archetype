#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.domain.specification;

import ${package}.${parentArtifactId}.domain.model.QCoisa;
import com.mysema.query.types.Predicate;
import java.math.BigDecimal;

/**
 *
 * @author munif
 */
public class CoisaSpecifications {

    private final QCoisa coisa = QCoisa.coisa;

    public Predicate coisaAtiva() {
        return coisa.ativo.eq(Boolean.TRUE); // melhor seria return coisa.ativo mas para exemplo
    }

    public Predicate coisaCara() {
        return coisa.valor.goe(BigDecimal.TEN);
    }

}
