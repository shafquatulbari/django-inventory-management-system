from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    CustomUserRegistrationView,
    ProductListView,
    ProductAddView,
    ProductUpdateView,
    ProductDeleteView,
    CategoryListCreateView,
)

urlpatterns = [
    # Authentication Endpoints
    path('register/', CustomUserRegistrationView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Product Endpoints
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/add/', ProductAddView.as_view(), name='product-add'),
    path('products/update/<int:id>/', ProductUpdateView.as_view(), name='product-update'),
    path('products/delete/<int:id>/', ProductDeleteView.as_view(), name='product-delete'),

    # Category Endpoints
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
]