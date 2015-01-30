#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ${package}.${parentArtifactId}.seed;

import ${package}.${parentArtifactId}.application.service.CoisaService;
import ${package}.${parentArtifactId}.domain.model.Coisa;
import gumga.framework.domain.seed.AppSeed;
import java.io.IOException;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author munif
 */
@Component
public class CoisaSeed implements AppSeed {

    @Autowired
    private CoisaService service;

    @Override
    public void loadSeed() throws IOException {
        service.save(new Coisa("Abacaxi", BigDecimal.ONE, true));
        service.save(new Coisa("Mamão", BigDecimal.TEN, false));
        service.save(new Coisa("Cidra", BigDecimal.valueOf(12.2), true));
        service.save(new Coisa("Laranja", BigDecimal.valueOf(20.2), false));
        service.save(new Coisa("Limão", BigDecimal.valueOf(10.22), true));
        service.save(new Coisa("Tangerina", BigDecimal.valueOf(110.2), false));
        service.save(new Coisa("Goiaba", BigDecimal.valueOf(102.2), true));
        service.save(new Coisa("Maracujá", BigDecimal.valueOf(310.2), false));
        service.save(new Coisa("Marmelo", BigDecimal.valueOf(410.2), true));
        service.save(new Coisa("Figo", BigDecimal.valueOf(210.2), false));
        service.save(new Coisa("Abacate", BigDecimal.valueOf(0.2), true));
        service.save(new Coisa("Açaí", BigDecimal.valueOf(3.2), false));
        service.save(new Coisa("Ameixa", BigDecimal.valueOf(5.2), true));
    }

}
