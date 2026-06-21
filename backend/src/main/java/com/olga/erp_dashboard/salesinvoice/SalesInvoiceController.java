package com.olga.erp_dashboard.salesinvoice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SalesInvoiceController {

    private final SalesInvoiceService salesInvoiceService;

    public SalesInvoiceController(SalesInvoiceService salesInvoiceService) {
        this.salesInvoiceService = salesInvoiceService;
    }

    @GetMapping("/api/sales-invoices")
    public List<SalesInvoiceDto> getSalesInvoices() throws Exception {
        return salesInvoiceService.getSalesInvoices();
    }

    @GetMapping("/api/kpi/sales-invoices")
    public SalesInvoiceKpiDto getSalesInvoiceKpi() throws Exception {
        return salesInvoiceService.getSalesInvoiceKpi();
    }
}