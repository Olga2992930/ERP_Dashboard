package com.olga.erp_dashboard.postedsalesinvoice;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

@Service
public class PostedSalesInvoiceService {

    private final PostedSalesInvoiceRepository postedSalesInvoiceRepository;

    public PostedSalesInvoiceService(PostedSalesInvoiceRepository postedSalesInvoiceRepository) {
        this.postedSalesInvoiceRepository = postedSalesInvoiceRepository;
    }

    public List<PostedSalesInvoiceDto> getPostedSalesInvoices() throws Exception {
        return postedSalesInvoiceRepository.getPostedSalesInvoices();
    }

    public PostedSalesInvoiceKpiDto getPostedSalesInvoiceKpi() throws Exception {
        List<PostedSalesInvoiceDto> invoices =
                postedSalesInvoiceRepository.getPostedSalesInvoices();

        PostedSalesInvoiceKpiDto kpi = new PostedSalesInvoiceKpiDto();

        kpi.postedInvoicesCount = invoices.size();

        Map<String, PostedSalesInvoiceCurrencyKpiDto> currencies = new TreeMap<>();
        for (PostedSalesInvoiceDto invoice : invoices) {
            String currencyCode = normalizeCurrencyCode(invoice.currencyCode);
            PostedSalesInvoiceCurrencyKpiDto currency = currencies.computeIfAbsent(currencyCode, code -> {
                PostedSalesInvoiceCurrencyKpiDto totals = new PostedSalesInvoiceCurrencyKpiDto();
                totals.currencyCode = code;
                return totals;
            });
            currency.totalAmountExcludingTax += invoice.totalAmountExcludingTax;
            currency.totalAmountIncludingTax += invoice.totalAmountIncludingTax;
            currency.totalTaxAmount += invoice.totalAmountIncludingTax - invoice.totalAmountExcludingTax;
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
