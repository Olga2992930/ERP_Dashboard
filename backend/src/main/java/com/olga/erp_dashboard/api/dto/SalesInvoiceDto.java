package com.olga.erp_dashboard.api.dto;

public class SalesInvoiceDto {

    public String id;
    public String number;

    public String invoiceDate;
    public String postingDate;
    public String dueDate;

    public String customerNumber;
    public String customerName;

    public String currencyCode;

    public double remainingAmount;
    public double totalAmountExcludingTax;
    public double totalTaxAmount;
    public double totalAmountIncludingTax;

    public String status;
    public String salesperson;

    public String email;
}