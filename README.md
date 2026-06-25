# ERP Dashboard

ERP Dashboard is a backend learning project built with Java and Spring Boot.

The application connects to Microsoft Dynamics 365 Business Central, reads invoice data, and exposes REST API endpoints for invoices and KPI calculations.

Later, the project may grow toward AI-assisted ERP features, such as “Chat with your ERP”.

## Why this project exists

ERP systems contain a lot of important business data, but it is often not easy to access quickly.

From my previous work as an accounting assistant, I know that even simple questions can require manual reports, exports, or checking data in several places.

This project explores how ERP data can be made easier to use through clean API endpoints, KPI calculations, and later AI-assisted features like “Chat with your ERP”.

The ERP system remains the source of truth. This application is an extra layer for analytics, search, and future AI functionality.

## Key features

* Integration with Microsoft Dynamics 365 Business Central API
* Automatic OAuth 2.0 client credentials authentication for Business Central
* Google login with OpenID Connect
* Sales invoice API endpoints
* Posted sales invoice API endpoints
* KPI endpoints for invoice analytics
* Unit and controller tests with JUnit, Mockito, and MockMvc

## Tech stack

* Java 21
* Spring Boot 4
* Maven Wrapper
* Spring Security
* Google OpenID Connect
* Microsoft Dynamics 365 Business Central API
* JUnit
* Mockito
* MockMvc
* Bruno

## Quick start

The backend is located in the `backend` folder.

### 1. Go to the backend folder

```powershell
cd backend
```

### 2. Run tests

```powershell
.\mvnw.cmd test
```

### 3. Run the application

```powershell
.\mvnw.cmd spring-boot:run
```

The application starts on:

```text
http://localhost:8080
```

## Local configuration

Local secrets are stored in:

```text
backend/src/main/resources/application.properties
```

This file must not be committed to Git.

Required local configuration:

```properties
business-central.tenant=...
business-central.environment=...
business-central.company-id=...
business-central.client-id=...
business-central.client-secret=...

spring.security.oauth2.client.registration.google.client-id=...
spring.security.oauth2.client.registration.google.client-secret=...
spring.security.oauth2.client.registration.google.scope=openid,profile,email
```

## Basic usage examples

Open the application in a browser and log in with Google.

Sales invoices:

```text
GET /api/sales-invoices
GET /api/kpi/sales-invoices
```

Posted sales invoices:

```text
GET /api/posted-sales-invoices
GET /api/kpi/posted-sales-invoices
```

The API can also be tested with Bruno or another API client.

## Ideas to explore next

Possible next steps for this learning project:

* Add a local JSON datasource for offline development
* Add more Business Central entities, such as customers or customer ledger entries
* Improve KPI logic for customer debt and aging
* Explore a database datasource for structured analytics
* Try a small RAG prototype for ERP-related documents
* Explore how a “Chat with your ERP” feature could work
