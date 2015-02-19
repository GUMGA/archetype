define(function (require) {
    return require('angular').module('basetemplate', [])
            .directive('gumgaBaseMenu', function () {
                return {
                    restrict: 'E',
                    template:
                            "<div class=\"gumga-offcanvas-sidebar\">" 
                            + "  <gumga-menu open=\"CRUD\"> \n" 
                            + "    <br\>" 
                            + "    <ul>\n" +
                            + "	     <li>\n"
                            + "	       <a href=\"/${rootArtifactId} \">Home</a>\n"
                            + "	     </li>\n"
                            + "      <li>"
                            +"         <a href=\"/${rootArtifactId}/crud/coisa/base.html\" gumga-menu-id=\"coisa\">Coisa</a>"
                            +"       </li>\n"
                            + "    </ul>"
                            + "  </gumga-menu>"
                            + "</div>"
                }
            })
            .directive('gumgaNavBar', function () {
                return {
                    restrict: 'E',
                    template:
                            "<div class=\"navbar navbar-gumga navbar-fixed-top\" role=\"navigation\">\n" +
                            "            <div class=\"navbar-header\">\n" +
                            "                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n" +
                            "                    <span class=\"sr-only\">Toggle navigation</span> \n" +
                            "                    <span class=\"icon-bar\"></span> \n" +
                            "                    <span class=\"icon-bar\"></span>  \n" +
                            "                    <span class=\"icon-bar\"></span>\n" +
                            "                </button>\n" +
                            "                <button class=\"gumga-offcanvas-reveal\">Exibir Menu</button>\n" +
                            "\n" +
                            "                <a class=\"navbar-brand\" href=\" \"> ${rootArtifactId}</a>\n" +
                            "            </div>\n" +
                            "            <div class=\"collapse navbar-collapse\">\n" +
                            "                <div class=\"collapse navbar-collapse pull-right\" style=\"color: white;\">\n" +
                            "                    <ul class=\"nav navbar-nav\">\n" +
                            "                        <li class=\"dropdown\">\n" +
                            "                            <a href=\"#\" dropdown-toggle>Você está logado como: <strong>Usuário</strong> <b class=\"caret\"></b></a>\n" +
                            "                            <ul class=\"dropdown-menu\">\n" +
                            "                                <li><a href=\"http://localhost:8084/${rootArtifactId}/\"><span class=\"glyphicon glyphicon-off\"></span> Sair</a></li>\n" +
                            "                            </ul>\n" +
                            "                        </li>\n" +
                            "                    </ul>\n" +
                            "                </div>\n" +
                            "            </div>"

                }
            })


})


