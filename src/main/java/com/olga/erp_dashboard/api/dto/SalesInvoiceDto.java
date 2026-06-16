package com.olga.erp_dashboard.api.dto;

public class SalesInvoiceDto {
    public String number;
    public String customerName;
    public String customerNumber;

    public String invoiceDate;
    public String dueDate;

    public String status;
    public String currencyCode;

    public double totalAmountExcludingTax;
    public double totalTaxAmount;
    public double totalAmountIncludingTax;
    public double remainingAmount;
}
