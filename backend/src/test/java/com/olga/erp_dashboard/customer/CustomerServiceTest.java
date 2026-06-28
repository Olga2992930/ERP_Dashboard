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
}
