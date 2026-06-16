package com.olga.erp_dashboard.api;

import com.olga.erp_dashboard.api.dto.SalesInvoiceDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesInvoiceService {

    private final SalesInvoiceRepository salesInvoiceRepository;

    @Autowired
    public SalesInvoiceService(SalesInvoiceRepository salesInvoiceRepository) {
        this.salesInvoiceRepository = salesInvoiceRepository;
    }

    public List<SalesInvoiceDto> getSalesInvoices() throws Exception {
        return salesInvoiceRepository.getSalesInvoices();
    }
}