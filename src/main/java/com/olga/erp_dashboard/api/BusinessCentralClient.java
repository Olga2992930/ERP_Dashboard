package com.olga.erp_dashboard.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Component
public class BusinessCentralClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${business-central.access-token}")
    private String accessToken;

    @Value("${business-central.tenant}")
    private String tenant;

    @Value("${business-central.environment}")
    private String environment;

    @Value("${business-central.company-id}")
    private String companyId;

    public String getSalesInvoices() {
        String url = "https://api.businesscentral.dynamics.com/v2.0/"
                + tenant
                + "/"
                + environment
                + "/api/v2.0/companies("
                + companyId
                + ")/salesInvoices";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }
}
