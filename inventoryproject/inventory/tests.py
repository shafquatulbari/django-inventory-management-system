from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import CustomUser, Product, Category

class UserTests(APITestCase):
    def test_register_user(self):
        """
        Ensure we can register a new user.
        """
        url = reverse('register')
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
            "is_admin": True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], "newuser")
        self.assertIn('email', response.data)
    
    def test_login_user(self):
        """
        Ensure we can log in with registered credentials.
        """
        # Register a user first
        self.test_register_user()
        # Now test login
        url = reverse('token_obtain_pair')
        data = {
            "username": "newuser",
            "password": "password123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


class ProductTests(APITestCase):
    def setUp(self):
        # Create an admin user and get authentication token
        self.admin_user = CustomUser.objects.create_user(
            username="adminuser",
            email="admin@example.com",
            password="password123",
            is_admin=True
        )
        login_url = reverse('token_obtain_pair')
        login_data = {
            "username": "adminuser",
            "password": "password123"
        }
        login_response = self.client.post(login_url, login_data, format='json')
        self.access_token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

        # Create a category for products
        self.category = Category.objects.create(name="Electronics", description="Electronic products")

    def test_add_product(self):
        """
        Ensure we can add a new product as an admin.
        """
        url = reverse('product-add')
        data = {
            "name": "Laptop",
            "category": self.category.id,
            "price": 999.99,
            "quantity": 10,
            "description": "A powerful laptop",
            "stock_level": 10
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Laptop")
        self.assertEqual(response.data['category'], self.category.id)

    def test_view_products(self):
        """
        Ensure we can view a list of products.
        """
        # First, create a product
        self.test_add_product()

        url = reverse('product-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_update_product(self):
        """
        Ensure we can update a product as an admin.
        """
        # Create a product to update
        self.test_add_product()
        product = Product.objects.first()

        url = reverse('product-update', kwargs={'id': product.id})
        data = {
            "price": 899.99,
            "quantityChange": 5
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['price']), 899.99)
        self.assertEqual(response.data['quantity'], product.quantity + 5)  # Ensure quantity adjusted

    def test_delete_product(self):
        """
        Ensure we can delete a product as an admin.
        """
        # Create a product to delete
        self.test_add_product()
        product = Product.objects.first()

        url = reverse('product-delete', kwargs={'id': product.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)


class CategoryTests(APITestCase):
    def setUp(self):
        # Create an admin user for authorization
        self.admin_user = CustomUser.objects.create_user(
            username="adminuser",
            email="admin@example.com",
            password="password123",
            is_admin=True
        )
        login_url = reverse('token_obtain_pair')
        login_data = {
            "username": "adminuser",
            "password": "password123"
        }
        login_response = self.client.post(login_url, login_data, format='json')
        self.access_token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_create_category(self):
        """
        Ensure we can create a new category.
        """
        url = reverse('category-list-create')
        data = {
            "name": "Books",
            "description": "A collection of books"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Books")

    def test_view_categories(self):
        """
        Ensure we can view categories.
        """
        # First, create a category
        self.test_create_category()

        url = reverse('category-list-create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_update_category(self):
        """
        Ensure we can update a category as an admin.
        """
        # Create a category to update
        self.test_create_category()
        category = Category.objects.first()

        url = reverse('category-detail', kwargs={'pk': category.id})
        data = {
            "name": "Updated Books",
            "description": "Updated description"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Updated Books")

    def test_delete_category(self):
        """
        Ensure we can delete a category and unassign products from it.
        """
        # Create a category and a product assigned to this category
        self.test_create_category()
        category = Category.objects.first()
        product = Product.objects.create(
            name="Test Product",
            category=category,
            price=10.00,
            quantity=5,
            description="A test product",
            stock_level=5
        )

        url = reverse('category-detail', kwargs={'pk': category.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        product.refresh_from_db()
        self.assertIsNone(product.category)
