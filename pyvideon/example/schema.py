import graphene
import requests
from graphene_django import DjangoObjectType

from .models import Book, Category, Grocery


class Todo(graphene.ObjectType):
    user_id = graphene.Int()
    id = graphene.Int()
    title = graphene.String()
    completed = graphene.Boolean()


class CategoryType(DjangoObjectType):
    extra_data = graphene.Field(Todo)

    class Meta:
        model = Category
        fields = ("id", "title")

    def resolve_extra_data(self, info):
        resp = requests.get("https://jsonplaceholder.typicode.com/todos/1")
        if resp.ok:
            return resp.json()
        else:
            return {}


class BookType(DjangoObjectType):
    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "author",
            "isbn",
            "pages",
            "price",
            "quantity",
            "description",
            "imageurl",
            "status",
            "date_created",
        )


class GroceryType(DjangoObjectType):
    class Meta:
        model = Grocery
        fields = (
            "product_tag",
            "name",
            "category",
            "price",
            "quantity",
            "imageurl",
            "status",
            "date_created",
        )


class Query(graphene.ObjectType):
    categories = graphene.List(CategoryType)
    books = graphene.List(BookType)
    groceries = graphene.List(GroceryType)

    def resolve_books(self, info, **kwargs):
        # Querying a list
        return Book.objects.all()

    def resolve_categories(self, info, **kwargs):
        # Querying a list
        return Category.objects.all()

    def resolve_groceries(self, info, **kwargs):
        # Querying a list
        return Grocery.objects.all()


schema = graphene.Schema(query=Query)
