import graphene

from pyvideon.previews.schema import PreviewsQuery


class Query(PreviewsQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
