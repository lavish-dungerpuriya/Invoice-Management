from django.test import TestCase

# Create your tests here.
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Invoice

class InvoiceAPITestCase(APITestCase):
    def setUp(self):
        self.invoice_payload = {
            "invoice_number": "INV001",
            "customer_name": "John Doe",
            "date": "2024-11-30",
            "details": [
                {"description": "Product A", "quantity": 2, "unit_price": 50.00}
            ]
        }

    def test_create_invoice(self):
        response = self.client.post('/api/invoices/', self.invoice_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_invoice(self):
        self.client.post('/api/invoices/', self.invoice_payload, format='json')
        response = self.client.get('/api/invoices/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
