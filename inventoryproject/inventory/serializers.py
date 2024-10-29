from rest_framework import serializers
from .models import CustomUser, Category, Product

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'is_admin')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        """Check that the username is unique."""
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken. Please choose another.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_admin=validated_data.get('is_admin', False)
        )
        return user
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')  # Add category name as a custom field

    class Meta:
        model = Product
        fields = ('id', 'name', 'category', 'category_name', 'price', 'quantity', 'description', 'stock_level')
