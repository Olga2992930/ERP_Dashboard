package com.olga.erp_dashboard.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class BusinessCentralClient {

   @Value("${business-central.access-token}")
    private String accessToken;

    public String getSalesInvoices() {
        return accessToken;
    }
}
