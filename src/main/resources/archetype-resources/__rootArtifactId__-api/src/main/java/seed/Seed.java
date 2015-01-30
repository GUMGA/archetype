#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${parentArtifactId}.seed;

import gumga.framework.domain.seed.AppSeed;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class Seed implements ApplicationListener<ContextRefreshedEvent> {

	@Autowired
	@Qualifier("coisaSeed")
	private AppSeed coisaSeed;
	
	private AtomicBoolean started = new AtomicBoolean(false);

	public void onApplicationEvent(ContextRefreshedEvent event) {
		if (started.get()) return;
		
		for (AppSeed seed : seeds()) {
			try {
				seed.loadSeed();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}
		
		started.set(true);
	}
	
	
	private List<AppSeed> seeds() {
		List<AppSeed> list = new LinkedList<>();
		list.add(coisaSeed);
		return list;
	}

}
