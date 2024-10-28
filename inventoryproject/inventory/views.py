from rest_framework import generics, permissions 
from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Category, Product, CustomUser
from .serializers import CategorySerializer, ProductSerializer, CustomUserSerializer
from .permissions import IsAdminUser

# Registration View (No changes required)
class CustomUserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

# Product Views
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]  # Accessible by all logged-in users

class ProductAddView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]  # Admin-only access

class ProductUpdateView(APIView):
    permission_classes = [IsAdminUser]  # Admin-only access

    def put(self, request, id):
        return self.update_product(request, id)

    def patch(self, request, id):
        return self.update_product(request, id)

    def update_product(self, request, id):
        product = get_object_or_404(Product, id=id)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDeleteView(APIView):
    permission_classes = [IsAdminUser]  # Admin-only access

    def get_object(self, id):
        return get_object_or_404(Product, id=id)

    def delete(self, request, id):
        product = self.get_object(id)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Category Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]  # Accessible by all logged-in users
