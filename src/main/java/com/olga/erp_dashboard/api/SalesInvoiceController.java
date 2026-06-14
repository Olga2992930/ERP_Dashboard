package com.olga.erp_dashboard.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class SalesInvoiceController {

    private final SalesInvoiceService salesInvoiceService;

    @Autowired
    public SalesInvoiceController(SalesInvoiceService salesInvoiceService) {
        this.salesInvoiceService = salesInvoiceService;
    }

    @GetMapping("/api/sales-invoices")
    public List<String> getSalesInvoices() {
        return salesInvoiceService.getSalesInvoices();
    }

    @PostMapping("/api/sales-invoice")
    public String createSalesInvoice(@RequestBody String title) {
        this.salesInvoiceService.createSalesInvoice(title);
        return "Success!";
    }
}