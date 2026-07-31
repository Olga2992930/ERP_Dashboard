package com.olga.erp_dashboard.salesinvoice;

import java.util.List;

public class SalesInvoiceKpiDto {
    public int invoicesCount;
    public int openInvoicesCount;
    public List<SalesInvoiceCurrencyKpiDto> currencies = List.of();
}
