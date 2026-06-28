package com.olga.erp_dashboard.customer;

import com.olga.erp_dashboard.datasource.businesscentral.BusinessCentralClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomerRepository {

    private final BusinessCentralClient businessCentralClient;

    public CustomerRepository(BusinessCentralClient businessCentralClient) {
        this.businessCentralClient = businessCentralClient;
    }

    public List<CustomerDto> getCustomers() throws Exception {
        return businessCentralClient.getCustomers();
    }
}
