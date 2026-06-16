package com.olga.erp_dashboard.api;

import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceDto;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostedSalesInvoiceRepository {

    private final BusinessCentralClient businessCentralClient;

    public PostedSalesInvoiceRepository(BusinessCentralClient businessCentralClient) {
        this.businessCentralClient = businessCentralClient;
    }

    public List<PostedSalesInvoiceDto> getPostedSalesInvoices() {
        return businessCentralClient.getPostedSalesInvoices();
    }
}
