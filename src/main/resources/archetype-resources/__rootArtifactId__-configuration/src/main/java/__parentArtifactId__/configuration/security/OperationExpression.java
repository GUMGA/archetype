#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.configuration.security;

public class OperationExpression {

    public String url, method, operation;

    public OperationExpression(String operation, String url, String method) {
        this.url = url;
        this.method = method;
        this.operation = operation;
    }
}
