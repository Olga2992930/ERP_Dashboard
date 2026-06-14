package com.olga.erp_dashboard.api;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SalesInvoiceRepository {

    private final BusinessCentralClient businessCentralClient;

    private final List<String> salesInvoices = new ArrayList<>();

    public SalesInvoiceRepository(BusinessCentralClient businessCentralClient) {
        this.businessCentralClient = businessCentralClient;
    }

    public List<String> getSalesInvoices() {
        //return salesInvoices;
        return List.of(businessCentralClient.getSalesInvoices());
    }

    public void saveSalesInvoice(String title) {
        this.salesInvoices.add(title);
    }
}
