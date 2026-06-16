package com.olga.erp_dashboard.api.dto;

public class PostedSalesInvoiceDto {

    public String id;
    public String number;

    public String invoiceDate;
    public String postingDate;
    public String dueDate;

    public String customerNumber;
    public String customerName;

    public String currencyCode;

    public double totalAmountExcludingTax;
    public double totalAmountIncludingTax;

    public String salesperson;

    public String email;
}