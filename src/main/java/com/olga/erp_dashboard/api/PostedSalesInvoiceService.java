package com.olga.erp_dashboard.api;

import com.olga.erp_dashboard.api.dto.PostedSalesInvoiceDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostedSalesInvoiceService {

    private final PostedSalesInvoiceRepository postedSalesInvoiceRepository;

    public PostedSalesInvoiceService(PostedSalesInvoiceRepository postedSalesInvoiceRepository) {
        this.postedSalesInvoiceRepository = postedSalesInvoiceRepository;
    }

    public List<PostedSalesInvoiceDto> getPostedSalesInvoices() {
        return postedSalesInvoiceRepository.getPostedSalesInvoices();
    }
}
