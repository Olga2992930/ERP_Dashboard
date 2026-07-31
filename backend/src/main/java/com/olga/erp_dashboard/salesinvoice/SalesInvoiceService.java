package com.olga.erp_dashboard.salesinvoice;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

@Service
public class SalesInvoiceService {

    private final SalesInvoiceRepository salesInvoiceRepository;

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

        Map<String, SalesInvoiceCurrencyKpiDto> currencies = new TreeMap<>();
        for (SalesInvoiceDto invoice : invoices) {
            String currencyCode = normalizeCurrencyCode(invoice.currencyCode);
            SalesInvoiceCurrencyKpiDto currency = currencies.computeIfAbsent(currencyCode, code -> {
                SalesInvoiceCurrencyKpiDto totals = new SalesInvoiceCurrencyKpiDto();
                totals.currencyCode = code;
                return totals;
            });
            currency.totalRemainingAmount += invoice.remainingAmount;
            currency.totalAmountExcludingTax += invoice.totalAmountExcludingTax;
            currency.totalTaxAmount += invoice.totalTaxAmount;
            currency.totalAmountIncludingTax += invoice.totalAmountIncludingTax;
        }
        kpi.currencies = List.copyOf(currencies.values());

        return kpi;
    }

    private String normalizeCurrencyCode(String currencyCode) {
        return currencyCode == null || currencyCode.isBlank()
                ? "SEK"
                : currencyCode.trim().toUpperCase(Locale.ROOT);
    }
}
