package com.olga.erp_dashboard.api;

import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceKpiDto;

import java.util.List;

@RestController
public class PostedSalesInvoiceController {

    private final PostedSalesInvoiceService postedSalesInvoiceService;

    public PostedSalesInvoiceController(PostedSalesInvoiceService postedSalesInvoiceService) {
        this.postedSalesInvoiceService = postedSalesInvoiceService;
    }

    @GetMapping("/api/posted-sales-invoices")
    public List<PostedSalesInvoiceDto> getPostedSalesInvoices() {
        return postedSalesInvoiceService.getPostedSalesInvoices();
    }

    @GetMapping("/api/kpi/posted-sales-invoices")
    public PostedSalesInvoiceKpiDto getPostedSalesInvoiceKpi() {
        return postedSalesInvoiceService.getPostedSalesInvoiceKpi();
    }
}
