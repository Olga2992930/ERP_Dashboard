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

    public CustomerKpiDto getCustomerKpi() throws Exception {
        List<CustomerDto> customers = customerRepository.getCustomers();

        CustomerKpiDto kpi = new CustomerKpiDto();

        kpi.customersCount = customers.size();

        kpi.customersWithBalanceDueCount = (int) customers.stream()
                .filter(customer -> customer.balanceDue > 0)
                .count();

        kpi.totalBalanceDue = customers.stream()
                .mapToDouble(customer -> customer.balanceDue)
                .sum();

        kpi.totalCreditLimit = customers.stream()
                .mapToDouble(customer -> customer.creditLimit)
                .sum();

        return kpi;
    }
}
