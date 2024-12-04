from rest_framework import serializers
from .models import Invoice, InvoiceDetail

class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceDetail
        fields = ['id', 'description', 'quantity', 'unit_price', 'line_total']  # Include `id` for details

class InvoiceSerializer(serializers.ModelSerializer):
    invoice_details = InvoiceDetailSerializer(many=True)  # Ensure nested relationships are correctly serialized

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer_name', 'date', 'invoice_details']  # Added `id` field

    def create(self, validated_data):
        # Extract nested details
        details_data = validated_data.pop('invoice_details', [])
        invoice = Invoice.objects.create(**validated_data)  # Create Invoice

        # Create associated InvoiceDetails
        for detail_data in details_data:
            InvoiceDetail.objects.create(invoice=invoice, **detail_data)
        
        return invoice

    def update(self, instance, validated_data):
        # Update main invoice
        details_data = validated_data.pop('invoice_details', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update nested details
        instance.invoice_details.all().delete()  # Remove old details
        for detail_data in details_data:
            InvoiceDetail.objects.create(invoice=instance, **detail_data)
        
        return instance
