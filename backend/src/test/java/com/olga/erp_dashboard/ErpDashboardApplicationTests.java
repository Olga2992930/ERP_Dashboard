package com.olga.erp_dashboard;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.security.oauth2.client.registration.google.client-id=test-client-id",
		"spring.security.oauth2.client.registration.google.client-secret=test-client-secret",
		"spring.security.oauth2.client.registration.google.scope=openid,profile,email"
})
class ErpDashboardApplicationTests {

	@Test
	void contextLoads() {
	}

}
