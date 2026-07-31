package com.olga.erp_dashboard.postedsalesinvoice;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PostedSalesInvoiceServiceTest {

    // Two posted sales invoices
    @Test
    void shouldCalculatePostedSalesInvoiceKpi() throws Exception {
        // Given
        PostedSalesInvoiceRepository postedSalesInvoiceRepository =
                mock(PostedSalesInvoiceRepository.class);

        PostedSalesInvoiceDto invoice1 = new PostedSalesInvoiceDto();
        invoice1.currencyCode = "SEK";
        invoice1.totalAmountExcludingTax = 800.0;
        invoice1.totalAmountIncludingTax = 1000.0;

        PostedSalesInvoiceDto invoice2 = new PostedSalesInvoiceDto();
        invoice2.currencyCode = "EUR";
        invoice2.totalAmountExcludingTax = 1600.0;
        invoice2.totalAmountIncludingTax = 2000.0;

        when(postedSalesInvoiceRepository.getPostedSalesInvoices())
                .thenReturn(List.of(invoice1, invoice2));

        PostedSalesInvoiceService postedSalesInvoiceService =
                new PostedSalesInvoiceService(postedSalesInvoiceRepository);

        // When
        PostedSalesInvoiceKpiDto kpi =
                postedSalesInvoiceService.getPostedSalesInvoiceKpi();

        // Then
        assertEquals(2, kpi.postedInvoicesCount);
        assertEquals(2, kpi.currencies.size());
        assertEquals("EUR", kpi.currencies.get(0).currencyCode);
        assertEquals(1600.0, kpi.currencies.get(0).totalAmountExcludingTax);
        assertEquals(400.0, kpi.currencies.get(0).totalTaxAmount);
        assertEquals(2000.0, kpi.currencies.get(0).totalAmountIncludingTax);
        assertEquals("SEK", kpi.currencies.get(1).currencyCode);
        assertEquals(800.0, kpi.currencies.get(1).totalAmountExcludingTax);
        assertEquals(200.0, kpi.currencies.get(1).totalTaxAmount);
        assertEquals(1000.0, kpi.currencies.get(1).totalAmountIncludingTax);
    }

    // No posted sales invoices
    @Test
    void shouldReturnZeroKpiWhenThereAreNoPostedSalesInvoices() throws Exception {
        // Given
        PostedSalesInvoiceRepository postedSalesInvoiceRepository =
                mock(PostedSalesInvoiceRepository.class);

        when(postedSalesInvoiceRepository.getPostedSalesInvoices())
                .thenReturn(List.of());

        PostedSalesInvoiceService postedSalesInvoiceService =
                new PostedSalesInvoiceService(postedSalesInvoiceRepository);

        // When
        PostedSalesInvoiceKpiDto kpi =
                postedSalesInvoiceService.getPostedSalesInvoiceKpi();

        // Then
        assertEquals(0, kpi.postedInvoicesCount);
        assertEquals(List.of(), kpi.currencies);
    }
}
