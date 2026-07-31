package com.olga.erp_dashboard.postedsalesinvoice;

import java.util.List;

public class PostedSalesInvoiceKpiDto {
    public int postedInvoicesCount;
    public List<PostedSalesInvoiceCurrencyKpiDto> currencies = List.of();
}
