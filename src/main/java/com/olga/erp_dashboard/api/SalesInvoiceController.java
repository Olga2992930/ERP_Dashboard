package com.olga.erp_dashboard.api;

import com.olga.erp_dashboard.api.dto.SalesInvoiceDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SalesInvoiceController {

    private final SalesInvoiceService salesInvoiceService;

    @Autowired
    public SalesInvoiceController(SalesInvoiceService salesInvoiceService) {
        this.salesInvoiceService = salesInvoiceService;
    }

    @GetMapping("/api/sales-invoices")
    public List<SalesInvoiceDto> getSalesInvoices() throws Exception {
        return salesInvoiceService.getSalesInvoices();
    }
}