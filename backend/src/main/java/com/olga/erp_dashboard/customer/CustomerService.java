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

    public List<CustomerDto> getCustomersWithBalanceDue() throws Exception {
        return customerRepository.getCustomers().stream()
                .filter(customer -> customer.balanceDue > 0)
                .toList();
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

        kpi.averageBalanceDue = customers.stream()
                .mapToDouble(customer -> customer.balanceDue)
                .average()
                .orElse(0.0);

        kpi.largestBalanceDue = customers.stream()
                .mapToDouble(customer -> customer.balanceDue)
                .max()
                .orElse(0.0);

        return kpi;
    }
}
