package com.olga.erp_dashboard.customer;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerDto> getCustomers() throws Exception {
        return customerRepository.getCustomers();
    }
}
