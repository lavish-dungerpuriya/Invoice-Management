from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice
from .serializers import InvoiceSerializer
from rest_framework import viewsets
from django.db.models import Q
import logging
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

@api_view(['PUT'])
def update_invoice(request, id):
    try:
        invoice = Invoice.objects.get(id=id)
    except Invoice.DoesNotExist:
        return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = InvoiceSerializer(invoice, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_invoice(request, id):
    if request.method == "DELETE":
        invoice = get_object_or_404(Invoice, id=id)
        invoice.delete()
        return JsonResponse({"message": "Invoice deleted successfully"}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@api_view(['POST'])
def create_invoice(request):
    serializer = InvoiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvoiceListView(APIView):
    def get(self, request):
        search_query = request.GET.get('search', '').strip()
        if search_query:
            invoices = Invoice.objects.prefetch_related('invoice_details').filter(
                Q(customer_name__icontains=search_query) |
                Q(invoice_number__icontains=search_query)
            )
        else:
            invoices = Invoice.objects.all()
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Invoice Management System!")
