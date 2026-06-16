package com.olga.erp_dashboard.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import tools.jackson.databind.ObjectMapper;
import com.olga.erp_dashboard.api.dto.SalesInvoiceDto;
import com.olga.erp_dashboard.api.dto.SalesInvoiceResponse;
import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceDto;
import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceResponse;

import java.util.List;

@Component
public class BusinessCentralClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${business-central.access-token}")
    private String accessToken;

    @Value("${business-central.tenant}")
    private String tenant;

    @Value("${business-central.environment}")
    private String environment;

    @Value("${business-central.company-id}")
    private String companyId;

    List<SalesInvoiceDto> getSalesInvoices() throws Exception {
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
            headers.setBearerAuth(accessToken);

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
