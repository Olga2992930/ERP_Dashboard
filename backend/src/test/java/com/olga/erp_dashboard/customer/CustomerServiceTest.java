package com.olga.erp_dashboard.customer;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CustomerServiceTest {

    @Test
    void shouldReturnCustomers() throws Exception {
        // Given
        CustomerRepository customerRepository =
                mock(CustomerRepository.class);

        CustomerDto customer = new CustomerDto();
        customer.id = "customer-1";
        customer.number = "10000";
        customer.displayName = "Test Customer";

        when(customerRepository.getCustomers())
                .thenReturn(List.of(customer));

        CustomerService customerService =
                new CustomerService(customerRepository);

        // When
        List<CustomerDto> customers = customerService.getCustomers();

        // Then
        assertEquals(1, customers.size());
        assertEquals("customer-1", customers.get(0).id);
        assertEquals("10000", customers.get(0).number);
        assertEquals("Test Customer", customers.get(0).displayName);
    }

    @Test
    void shouldCalculateCustomerKpi() throws Exception {
        // Given
        CustomerRepository customerRepository =
                mock(CustomerRepository.class);

        CustomerDto customer1 = new CustomerDto();
        customer1.balanceDue = 1500.0;

        CustomerDto customer2 = new CustomerDto();
        customer2.balanceDue = 0.0;

        CustomerDto customer3 = new CustomerDto();
        customer3.balanceDue = 2500.0;

        when(customerRepository.getCustomers())
                .thenReturn(List.of(customer1, customer2, customer3));

        CustomerService customerService =
                new CustomerService(customerRepository);

        // When
        CustomerKpiDto kpi = customerService.getCustomerKpi();

        // Then
        assertEquals(3, kpi.customersCount);
        assertEquals(2, kpi.customersWithBalanceDueCount);
        assertEquals(4000.0, kpi.totalBalanceDue);
        assertEquals(1333.3333333333333, kpi.averageBalanceDue);
        assertEquals(2500.0, kpi.largestBalanceDue);
    }

    @Test
    void shouldReturnOnlyCustomersWithBalanceDue() throws Exception {
        // Given
        CustomerRepository customerRepository =
                mock(CustomerRepository.class);

        CustomerDto customerWithDebt = new CustomerDto();
        customerWithDebt.id = "customer-with-debt";
        customerWithDebt.balanceDue = 1500.0;

        CustomerDto customerWithoutDebt = new CustomerDto();
        customerWithoutDebt.id = "customer-without-debt";
        customerWithoutDebt.balanceDue = 0.0;

        when(customerRepository.getCustomers())
                .thenReturn(List.of(customerWithDebt, customerWithoutDebt));

        CustomerService customerService =
                new CustomerService(customerRepository);

        // When
        List<CustomerDto> customers = customerService.getCustomersWithBalanceDue();

        // Then
        assertEquals(1, customers.size());
        assertEquals("customer-with-debt", customers.get(0).id);
        assertEquals(1500.0, customers.get(0).balanceDue);
    }

    @Test
    void shouldReturnZeroKpiWhenThereAreNoCustomers() throws Exception {
        // Given
        CustomerRepository customerRepository =
                mock(CustomerRepository.class);

        when(customerRepository.getCustomers())
                .thenReturn(List.of());

        CustomerService customerService =
                new CustomerService(customerRepository);

        // When
        CustomerKpiDto kpi = customerService.getCustomerKpi();

        // Then
        assertEquals(0, kpi.customersCount);
        assertEquals(0, kpi.customersWithBalanceDueCount);
        assertEquals(0.0, kpi.totalBalanceDue);
        assertEquals(0.0, kpi.averageBalanceDue);
        assertEquals(0.0, kpi.largestBalanceDue);
    }
}
