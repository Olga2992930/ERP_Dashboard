package com.olga.erp_dashboard.api;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SalesInvoiceRepository {

    private final List<String> salesInvoices = new ArrayList<>();

    public List<String> getSalesInvoices() {
        return salesInvoices;
    }

    public void saveSalesInvoice(String title) {
        this.salesInvoices.add(title);
    }
}
