package com.olga.erp_dashboard.salesinvoice;

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

    public List<SalesInvoiceDto> getSalesInvoices() throws Exception {
        return salesInvoiceRepository.getSalesInvoices();
    }

    public SalesInvoiceKpiDto getSalesInvoiceKpi() throws Exception {
        List<SalesInvoiceDto> invoices = salesInvoiceRepository.getSalesInvoices();

        SalesInvoiceKpiDto kpi = new SalesInvoiceKpiDto();

        kpi.invoicesCount = invoices.size();

        kpi.openInvoicesCount = (int) invoices.stream()
                .filter(invoice -> invoice.remainingAmount > 0)
                .count();

        kpi.totalRemainingAmount = invoices.stream()
                .mapToDouble(invoice -> invoice.remainingAmount)
                .sum();

        kpi.totalAmountExcludingTax = invoices.stream()
                .mapToDouble(invoice -> invoice.totalAmountExcludingTax)
                .sum();

        kpi.totalTaxAmount = invoices.stream()
                .mapToDouble(invoice -> invoice.totalTaxAmount)
                .sum();

        kpi.totalAmountIncludingTax = invoices.stream()
                .mapToDouble(invoice -> invoice.totalAmountIncludingTax)
                .sum();

        return kpi;
    }
}