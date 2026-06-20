package com.olga.erp_dashboard.salesinvoice;

import com.olga.erp_dashboard.datasource.businesscentral.BusinessCentralClient;
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

    public List<SalesInvoiceDto> getSalesInvoices() throws Exception {
        return businessCentralClient.getSalesInvoices();
    }

    public void saveSalesInvoice(String title) {
        this.salesInvoices.add(title);
    }
}
