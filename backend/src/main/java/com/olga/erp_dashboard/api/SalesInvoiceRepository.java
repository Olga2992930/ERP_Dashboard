package com.olga.erp_dashboard.api;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import com.olga.erp_dashboard.api.dto.SalesInvoiceDto;

@Repository
public class SalesInvoiceRepository {

    private final BusinessCentralClient businessCentralClient;

    private final List<String> salesInvoices = new ArrayList<>();

    public SalesInvoiceRepository(BusinessCentralClient businessCentralClient) {
        this.businessCentralClient = businessCentralClient;
    }

    public List<SalesInvoiceDto> getSalesInvoices() throws Exception {
        return businessCentralClient.getSalesInvoices();
    }

    public void saveSalesInvoice(String title) {
        this.salesInvoices.add(title);
    }
}
