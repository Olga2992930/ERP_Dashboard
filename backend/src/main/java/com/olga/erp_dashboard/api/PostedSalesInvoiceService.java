package com.olga.erp_dashboard.api;

import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceDto;
import org.springframework.stereotype.Service;

import java.util.List;

import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceKpiDto;

@Service
public class PostedSalesInvoiceService {

    private final PostedSalesInvoiceRepository postedSalesInvoiceRepository;

    public PostedSalesInvoiceService(PostedSalesInvoiceRepository postedSalesInvoiceRepository) {
        this.postedSalesInvoiceRepository = postedSalesInvoiceRepository;
    }

    public List<PostedSalesInvoiceDto> getPostedSalesInvoices() {
        return postedSalesInvoiceRepository.getPostedSalesInvoices();
    }

    public PostedSalesInvoiceKpiDto getPostedSalesInvoiceKpi() {
        List<PostedSalesInvoiceDto> invoices =
                postedSalesInvoiceRepository.getPostedSalesInvoices();

        PostedSalesInvoiceKpiDto kpi = new PostedSalesInvoiceKpiDto();

        kpi.postedInvoicesCount = invoices.size();

        kpi.totalAmountExcludingTax = invoices.stream()
                .mapToDouble(invoice -> invoice.totalAmountExcludingTax)
                .sum();

        kpi.totalAmountIncludingTax = invoices.stream()
                .mapToDouble(invoice -> invoice.totalAmountIncludingTax)
                .sum();

        kpi.totalTaxAmount =
                kpi.totalAmountIncludingTax - kpi.totalAmountExcludingTax;

        return kpi;
    }
}
