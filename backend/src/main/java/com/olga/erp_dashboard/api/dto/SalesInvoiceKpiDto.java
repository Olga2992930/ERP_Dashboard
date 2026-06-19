package com.olga.erp_dashboard.api.dto;

public class SalesInvoiceKpiDto {
    public int invoicesCount;
    public int openInvoicesCount;

    public double totalRemainingAmount;

    public double totalAmountExcludingTax;
    public double totalTaxAmount;
    public double totalAmountIncludingTax;
}
