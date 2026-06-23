package com.olga.erp_dashboard.datasource.businesscentral;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import com.olga.erp_dashboard.salesinvoice.SalesInvoiceDto;
import com.olga.erp_dashboard.salesinvoice.SalesInvoiceResponse;
import com.olga.erp_dashboard.postedsalesinvoice.PostedSalesInvoiceDto;
import com.olga.erp_dashboard.postedsalesinvoice.PostedSalesInvoiceResponse;

import java.util.List;

@Component
public class BusinessCentralClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${business-central.tenant}")
    private String tenant;

    @Value("${business-central.environment}")
    private String environment;

    @Value("${business-central.company-id}")
    private String companyId;

    @Value("${business-central.client-id}")
    private String clientId;

    @Value("${business-central.client-secret}")
    private String clientSecret;

    private String getAccessToken() throws Exception {
        String url = "https://login.microsoftonline.com/"
                + tenant
                + "/oauth2/v2.0/token";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        String body = "client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&scope=https://api.businesscentral.dynamics.com/.default"
                + "&grant_type=client_credentials";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        JsonNode json = objectMapper.readTree(response.getBody());

        return json.get("access_token").asText();
    }

    public List<SalesInvoiceDto> getSalesInvoices() throws Exception {
        String url = "https://api.businesscentral.dynamics.com/v2.0/"
                + tenant
                + "/"
                + environment
                + "/api/v2.0/companies("
                + companyId
                + ")/salesInvoices";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getAccessToken());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        SalesInvoiceResponse salesInvoiceResponse =
                objectMapper.readValue(response.getBody(), SalesInvoiceResponse.class);

        return salesInvoiceResponse.value;
    }

    public List<PostedSalesInvoiceDto> getPostedSalesInvoices() {
        try {
            String url = "https://api.businesscentral.dynamics.com/v2.0/"
                    + tenant
                    + "/"
                    + environment
                    + "/api/microsoft/automate/v1.0/companies("
                    + companyId
                    + ")/postedSalesInvoices";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(getAccessToken());

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            PostedSalesInvoiceResponse postedSalesInvoiceResponse =
                    objectMapper.readValue(response.getBody(), PostedSalesInvoiceResponse.class);

            return postedSalesInvoiceResponse.value;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch posted sales invoices from Business Central", e);
        }
    }
}