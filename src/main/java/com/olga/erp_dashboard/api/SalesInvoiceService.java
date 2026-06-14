package com.olga.erp_dashboard.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesInvoiceService {

    private final SalesInvoiceRepository salesInvoiceRepository;

    @Autowired
    public SalesInvoiceService(SalesInvoiceRepository salesInvoiceRepository) {
        this.salesInvoiceRepository = salesInvoiceRepository;
    }


    public List<String> getSalesInvoices() {
        return this.salesInvoiceRepository.getSalesInvoices();
    }

    public void createSalesInvoice(String title) {
        if (title.isBlank()) {
            throw new IllegalArgumentException("Title may not be empty");
        }
        this.salesInvoiceRepository.saveSalesInvoice(title);
    }

}
