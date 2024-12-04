# Generated by Django 5.1.3 on 2024-12-02 06:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoices', '0005_alter_invoicedetail_line_total_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoicedetail',
            name='line_total',
            field=models.DecimalField(decimal_places=2, editable=False, max_digits=10),
        ),
        migrations.AlterField(
            model_name='invoicedetail',
            name='unit_price',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
    ]
