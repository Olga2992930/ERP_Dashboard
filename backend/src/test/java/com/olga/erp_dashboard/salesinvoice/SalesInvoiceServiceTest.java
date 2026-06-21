package com.olga.erp_dashboard.salesinvoice;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SalesInvoiceServiceTest {

    // One open invoice and one paid invoice
    @Test
    void shouldCalculateSalesInvoiceKpi() throws Exception {
        // Given
        SalesInvoiceRepository salesInvoiceRepository =
                mock(SalesInvoiceRepository.class);

        SalesInvoiceDto invoice1 = new SalesInvoiceDto();
        invoice1.remainingAmount = 1000.0;
        invoice1.totalAmountExcludingTax = 800.0;
        invoice1.totalTaxAmount = 200.0;
        invoice1.totalAmountIncludingTax = 1000.0;

        SalesInvoiceDto invoice2 = new SalesInvoiceDto();
        invoice2.remainingAmount = 0.0;
        invoice2.totalAmountExcludingTax = 1600.0;
        invoice2.totalTaxAmount = 400.0;
        invoice2.totalAmountIncludingTax = 2000.0;

        when(salesInvoiceRepository.getSalesInvoices())
                .thenReturn(List.of(invoice1, invoice2));

        SalesInvoiceService salesInvoiceService =
                new SalesInvoiceService(salesInvoiceRepository);

        // When
        SalesInvoiceKpiDto kpi = salesInvoiceService.getSalesInvoiceKpi();

        // Then
        assertEquals(2, kpi.invoicesCount);
        assertEquals(1, kpi.openInvoicesCount);

        assertEquals(1000.0, kpi.totalRemainingAmount);
        assertEquals(2400.0, kpi.totalAmountExcludingTax);
        assertEquals(600.0, kpi.totalTaxAmount);
        assertEquals(3000.0, kpi.totalAmountIncludingTax);
    }

    // All invoices are paid
    @Test
    void shouldReturnZeroOpenInvoicesWhenAllInvoicesArePaid() throws Exception {
        // Given
        SalesInvoiceRepository salesInvoiceRepository =
                mock(SalesInvoiceRepository.class);

        SalesInvoiceDto invoice1 = new SalesInvoiceDto();
        invoice1.remainingAmount = 0.0;
        invoice1.totalAmountExcludingTax = 800.0;
        invoice1.totalTaxAmount = 200.0;
        invoice1.totalAmountIncludingTax = 1000.0;

        SalesInvoiceDto invoice2 = new SalesInvoiceDto();
        invoice2.remainingAmount = 0.0;
        invoice2.totalAmountExcludingTax = 1600.0;
        invoice2.totalTaxAmount = 400.0;
        invoice2.totalAmountIncludingTax = 2000.0;

        when(salesInvoiceRepository.getSalesInvoices())
                .thenReturn(List.of(invoice1, invoice2));

        SalesInvoiceService salesInvoiceService =
                new SalesInvoiceService(salesInvoiceRepository);

        // When
        SalesInvoiceKpiDto kpi = salesInvoiceService.getSalesInvoiceKpi();

        // Then
        assertEquals(2, kpi.invoicesCount);
        assertEquals(0, kpi.openInvoicesCount);
        assertEquals(0.0, kpi.totalRemainingAmount);
        assertEquals(2400.0, kpi.totalAmountExcludingTax);
        assertEquals(600.0, kpi.totalTaxAmount);
        assertEquals(3000.0, kpi.totalAmountIncludingTax);
    }

    // No invoices
    @Test
    void shouldReturnZeroKpiWhenThereAreNoInvoices() throws Exception {
        // Given
        SalesInvoiceRepository salesInvoiceRepository =
                mock(SalesInvoiceRepository.class);

        when(salesInvoiceRepository.getSalesInvoices())
                .thenReturn(List.of());

        SalesInvoiceService salesInvoiceService =
                new SalesInvoiceService(salesInvoiceRepository);

        // When
        SalesInvoiceKpiDto kpi = salesInvoiceService.getSalesInvoiceKpi();

        // Then
        assertEquals(0, kpi.invoicesCount);
        assertEquals(0, kpi.openInvoicesCount);
        assertEquals(0.0, kpi.totalRemainingAmount);
        assertEquals(0.0, kpi.totalAmountExcludingTax);
        assertEquals(0.0, kpi.totalTaxAmount);
        assertEquals(0.0, kpi.totalAmountIncludingTax);
    }
}