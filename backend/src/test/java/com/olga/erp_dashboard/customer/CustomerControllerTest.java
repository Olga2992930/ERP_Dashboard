package com.olga.erp_dashboard.customer;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class CustomerControllerTest {

    @Test
    void shouldReturnCustomers() throws Exception {
        // Given
        CustomerService customerService =
                mock(CustomerService.class);

        CustomerDto customer = new CustomerDto();
        customer.id = "customer-1";
        customer.number = "10000";
        customer.displayName = "Test Customer";
        customer.email = "customer@example.com";
        customer.phoneNumber = "123456789";
        customer.balanceDue = 1500.0;
        customer.creditLimit = 5000.0;
        customer.currencyCode = "SEK";

        when(customerService.getCustomers())
                .thenReturn(List.of(customer));

        CustomerController customerController =
                new CustomerController(customerService);

        MockMvc mockMvc = standaloneSetup(customerController).build();

        // When / Then
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("customer-1"))
                .andExpect(jsonPath("$[0].number").value("10000"))
                .andExpect(jsonPath("$[0].displayName").value("Test Customer"))
                .andExpect(jsonPath("$[0].email").value("customer@example.com"))
                .andExpect(jsonPath("$[0].phoneNumber").value("123456789"))
                .andExpect(jsonPath("$[0].balanceDue").value(1500.0))
                .andExpect(jsonPath("$[0].creditLimit").value(5000.0))
                .andExpect(jsonPath("$[0].currencyCode").value("SEK"));
    }
}
