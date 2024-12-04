# Generated by Django 5.1.3 on 2024-12-02 05:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoices', '0004_remove_invoice_details_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoicedetail',
            name='line_total',
            field=models.DecimalField(decimal_places=2, editable=False, max_digits=20),
        ),
        migrations.AlterField(
            model_name='invoicedetail',
            name='unit_price',
            field=models.DecimalField(decimal_places=2, max_digits=20),
        ),
    ]
