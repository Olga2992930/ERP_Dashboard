package com.olga.erp_dashboard.salesinvoice;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class SalesInvoiceControllerTest {

    @Test
    void shouldReturnSalesInvoices() throws Exception {
        // Given
        SalesInvoiceService salesInvoiceService =
                mock(SalesInvoiceService.class);

        SalesInvoiceDto invoice = new SalesInvoiceDto();
        invoice.id = "invoice-1";
        invoice.number = "102199";
        invoice.customerNumber = "10000";
        invoice.customerName = "Test Customer";
        invoice.remainingAmount = 1000.0;
        invoice.totalAmountIncludingTax = 1000.0;
        invoice.status = "Draft";

        when(salesInvoiceService.getSalesInvoices())
                .thenReturn(List.of(invoice));

        SalesInvoiceController salesInvoiceController =
                new SalesInvoiceController(salesInvoiceService);

        MockMvc mockMvc = standaloneSetup(salesInvoiceController).build();

        // When / Then
        mockMvc.perform(get("/api/sales-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("invoice-1"))
                .andExpect(jsonPath("$[0].number").value("102199"))
                .andExpect(jsonPath("$[0].customerNumber").value("10000"))
                .andExpect(jsonPath("$[0].customerName").value("Test Customer"))
                .andExpect(jsonPath("$[0].remainingAmount").value(1000.0))
                .andExpect(jsonPath("$[0].totalAmountIncludingTax").value(1000.0))
                .andExpect(jsonPath("$[0].status").value("Draft"));
    }

    @Test
    void shouldReturnSalesInvoiceKpi() throws Exception {
        // Given
        SalesInvoiceService salesInvoiceService =
                mock(SalesInvoiceService.class);

        SalesInvoiceKpiDto kpi = new SalesInvoiceKpiDto();
        kpi.invoicesCount = 2;
        kpi.openInvoicesCount = 1;
        kpi.totalRemainingAmount = 1000.0;
        kpi.totalAmountExcludingTax = 2400.0;
        kpi.totalTaxAmount = 600.0;
        kpi.totalAmountIncludingTax = 3000.0;

        when(salesInvoiceService.getSalesInvoiceKpi())
                .thenReturn(kpi);

        SalesInvoiceController salesInvoiceController =
                new SalesInvoiceController(salesInvoiceService);

        MockMvc mockMvc = standaloneSetup(salesInvoiceController).build();

        // When / Then
        mockMvc.perform(get("/api/kpi/sales-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.invoicesCount").value(2))
                .andExpect(jsonPath("$.openInvoicesCount").value(1))
                .andExpect(jsonPath("$.totalRemainingAmount").value(1000.0))
                .andExpect(jsonPath("$.totalAmountExcludingTax").value(2400.0))
                .andExpect(jsonPath("$.totalTaxAmount").value(600.0))
                .andExpect(jsonPath("$.totalAmountIncludingTax").value(3000.0));
    }
}