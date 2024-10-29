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

class UserInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Accessible by all logged-in users
    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

# Product Views
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]  # Accessible by all logged-in users

# Product Add View
class ProductAddView(APIView):
    permission_classes = [IsAdminUser]  # Admin-only access

    def post(self, request):
        data = request.data
        # Check if the product already exists
        existing_product = Product.objects.filter(name=data.get('name')).first()

        if existing_product:
            # Increment the stock if the product already exists
            quantity_to_add = int(data.get('quantity', 0))
            if quantity_to_add <= 0:
                return Response(
                    {"error": "Quantity must be a positive number."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Update existing product details
            existing_product.stock_level += quantity_to_add
            existing_product.quantity += quantity_to_add
            existing_product.price = data.get('price', existing_product.price)
            existing_product.description = data.get('description', existing_product.description)
            
            existing_product.save()
            serializer = ProductSerializer(existing_product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create a new product if it doesn't exist
            serializer = ProductSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Product Update View
class ProductUpdateView(APIView):
    permission_classes = [IsAdminUser]  # Admin-only access

    def put(self, request, id):
        product = get_object_or_404(Product, id=id)
        data = request.data

        # Adjust stock level based on quantityChange
        quantity_change = int(data.get('quantityChange', 0))
        new_stock_level = product.stock_level + quantity_change

        # Validate the stock level
        if new_stock_level < 1:
            return Response(
                {"error": "Stock cannot be less than 1."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update other fields
        product.stock_level = new_stock_level
        product.quantity = new_stock_level  # sync quantity with stock level
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.description = data.get('description', product.description)
        
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


    
class ProductsByCategoryView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Accessible by all logged-in users

    def get(self, request, category_id):
        products = Product.objects.filter(category_id=category_id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

# Product Delete View
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
    #can be accessed by everyone
    permission_classes = [permissions.IsAuthenticated]
    #add category with name and description
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    #modify category with name and description
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
