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
        invoice1.totalAmountExcludingTax = 800.0;
        invoice1.totalAmountIncludingTax = 1000.0;

        PostedSalesInvoiceDto invoice2 = new PostedSalesInvoiceDto();
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
        assertEquals(2400.0, kpi.totalAmountExcludingTax);
        assertEquals(600.0, kpi.totalTaxAmount);
        assertEquals(3000.0, kpi.totalAmountIncludingTax);
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
        assertEquals(0.0, kpi.totalAmountExcludingTax);
        assertEquals(0.0, kpi.totalTaxAmount);
        assertEquals(0.0, kpi.totalAmountIncludingTax);
    }
}