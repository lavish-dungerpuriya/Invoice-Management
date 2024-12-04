from django.contrib import admin
from django.urls import path
from invoices.views import home, InvoiceListView, create_invoice, update_invoice, delete_invoice

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/invoices/', InvoiceListView.as_view(), name='invoice-list'),  # Handles GET requests
    path('api/invoices/create/', create_invoice, name='create-invoice'),    # Handles POST requests
    path('api/invoices/<int:id>/update/', update_invoice, name='update-invoice'),  # Handles PUT requests for update
    path('api/invoices/<int:id>/delete/', delete_invoice, name='delete-invoice'),  # Handles DELETE requests for delete
    path('', home, name='home'),  # Root URL - home view
]
