#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.api;

import gumga.framework.security.ApiOperationTranslator;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 *
 * @author munif
 */
@Component
public class GumgaRegexApiOperationTranslator implements ApiOperationTranslator {

    private final List<OperationExpression> operations = Arrays.asList(
            new OperationExpression("INSERT_COISA", ".*/erp-api/api/coisa/.*", "PUT"),
            new OperationExpression("READ_COISA", ".*/erp-api/api/coisa/.*", "GET")
    );

    public String getOperation(String url, String method) {
        for (OperationExpression oe : operations) {
            if (url.matches(oe.url) && method.matches(oe.method)) {
                return oe.operation;
            }
        }
        return "NOOP";

    }

    class OperationExpression {

        public String url, method, operation;

        public OperationExpression(String operation, String url, String method) {
            this.url = url;
            this.method = method;
            this.operation = operation;
        }

    }

}
