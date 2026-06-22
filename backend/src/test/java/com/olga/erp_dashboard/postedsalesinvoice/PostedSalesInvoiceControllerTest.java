package com.olga.erp_dashboard.postedsalesinvoice;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class PostedSalesInvoiceControllerTest {

    @Test
    void shouldReturnPostedSalesInvoices() throws Exception {
        // Given
        PostedSalesInvoiceService postedSalesInvoiceService =
                mock(PostedSalesInvoiceService.class);

        PostedSalesInvoiceDto invoice = new PostedSalesInvoiceDto();
        invoice.id = "posted-invoice-1";
        invoice.number = "103001";
        invoice.customerNumber = "10000";
        invoice.customerName = "Test Customer";
        invoice.totalAmountExcludingTax = 800.0;
        invoice.totalAmountIncludingTax = 1000.0;

        when(postedSalesInvoiceService.getPostedSalesInvoices())
                .thenReturn(List.of(invoice));

        PostedSalesInvoiceController postedSalesInvoiceController =
                new PostedSalesInvoiceController(postedSalesInvoiceService);

        MockMvc mockMvc = standaloneSetup(postedSalesInvoiceController).build();

        // When / Then
        mockMvc.perform(get("/api/posted-sales-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("posted-invoice-1"))
                .andExpect(jsonPath("$[0].number").value("103001"))
                .andExpect(jsonPath("$[0].customerNumber").value("10000"))
                .andExpect(jsonPath("$[0].customerName").value("Test Customer"))
                .andExpect(jsonPath("$[0].totalAmountExcludingTax").value(800.0))
                .andExpect(jsonPath("$[0].totalAmountIncludingTax").value(1000.0));
    }

    @Test
    void shouldReturnPostedSalesInvoiceKpi() throws Exception {
        // Given
        PostedSalesInvoiceService postedSalesInvoiceService =
                mock(PostedSalesInvoiceService.class);

        PostedSalesInvoiceKpiDto kpi = new PostedSalesInvoiceKpiDto();
        kpi.postedInvoicesCount = 2;
        kpi.totalAmountExcludingTax = 2400.0;
        kpi.totalTaxAmount = 600.0;
        kpi.totalAmountIncludingTax = 3000.0;

        when(postedSalesInvoiceService.getPostedSalesInvoiceKpi())
                .thenReturn(kpi);

        PostedSalesInvoiceController postedSalesInvoiceController =
                new PostedSalesInvoiceController(postedSalesInvoiceService);

        MockMvc mockMvc = standaloneSetup(postedSalesInvoiceController).build();

        // When / Then
        mockMvc.perform(get("/api/kpi/posted-sales-invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.postedInvoicesCount").value(2))
                .andExpect(jsonPath("$.totalAmountExcludingTax").value(2400.0))
                .andExpect(jsonPath("$.totalTaxAmount").value(600.0))
                .andExpect(jsonPath("$.totalAmountIncludingTax").value(3000.0));
    }
}