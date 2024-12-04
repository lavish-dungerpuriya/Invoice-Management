from django.db import models

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=255)
    date = models.DateField()

    def calculate_total(self):
        return sum(detail.quantity * detail.unit_price for detail in self.invoice_details.all())

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.customer_name}"


class InvoiceDetail(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        related_name='invoice_details',  # This matches the serializer field name
        on_delete=models.CASCADE
    )
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.line_total = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return self.description
