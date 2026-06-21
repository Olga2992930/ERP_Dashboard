package com.olga.erp_dashboard.postedsalesinvoice;

import com.olga.erp_dashboard.datasource.businesscentral.BusinessCentralClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostedSalesInvoiceRepository {

    private final BusinessCentralClient businessCentralClient;

    public PostedSalesInvoiceRepository(BusinessCentralClient businessCentralClient) {
        this.businessCentralClient = businessCentralClient;
    }

    public List<PostedSalesInvoiceDto> getPostedSalesInvoices() throws Exception {
        return businessCentralClient.getPostedSalesInvoices();
    }
}