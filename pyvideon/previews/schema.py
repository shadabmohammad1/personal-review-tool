import random

import graphene
import requests


class DeliveryDetail(graphene.ObjectType):
    video = graphene.String()


class ProjectDetail(graphene.ObjectType):
    name = graphene.String()
    id = graphene.String()
    created = graphene.String()
    creator = graphene.String()

    def resolve_creator(parent, info):
        first_name = parent.get("creator", {}).get("first_name")
        last_name = parent.get("creator", {}).get("last_name")
        return f"{first_name} {last_name}"

    def resolve_created_at(parent, info):
        return parent.get("created")


class VendorDetail(graphene.ObjectType):
    company_name = graphene.String()
    website = graphene.String()

    def resolve_company_name(parent, info):
        return parent.get("profile", {}).get("company_name")

    def resolve_website(parent, info):
        return parent.get("profile", {}).get("website")


class ServiceDetails(graphene.ObjectType):
    name = graphene.String()
    id = graphene.String()


class ShotDetail(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()
    artist = graphene.String()
    sourceURL = graphene.String()

    def resolve_name(parent, info):
        return parent.get("shot", {}).get("name")

    def resolve_artist(parent, info):
        first_name = parent.get("vendor", {}).get("first_name")
        last_name = parent.get("vendor", {}).get("last_name")
        return f"{first_name} {last_name}"

    def resolve_id(parent, info):
        return parent.get("shot", {}).get("id")

    def resolve_sourceURL(parent, info):
        return random.choice(
            ["http://localhost:3000/video/NBA_0180.mov", ""]
        )  # parent.get("source_video_url", "") #


class Attachment(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()
    url = graphene.String()


class Note(graphene.ObjectType):
    id = graphene.String()
    note_type = graphene.String()
    note = graphene.String()
    created_by = graphene.String()
    created_at = graphene.String()
    attachments = graphene.List(Attachment)

    def resolve_created_by(parent, info):
        first_name = parent.get("created_by", {}).get("first_name")
        last_name = parent.get("created_by", {}).get("last_name")
        return f"{first_name} {last_name}"

    def resolve_created_at(parent, info):
        return parent.get("created")


class Shot(graphene.ObjectType):
    id = graphene.String()
    version_number = graphene.Int()
    delivery_details = graphene.Field(DeliveryDetail)
    project_details = graphene.Field(ProjectDetail)
    vendor_details = graphene.Field(VendorDetail)
    service_details = graphene.Field(ServiceDetails)
    shot_details = graphene.Field(ShotDetail)
    deliveryType = graphene.String()
    shot_notes = graphene.List(Note)
    errorMessage = graphene.String()

    def resolve_deliveryType(parent, info):
        if "delivery_type" in parent:
            return parent.get("delivery_type")

    def resolve_errorMessage(parent, info):
        if parent == "error":
            return "You are not authorized to the current project"


class PreviewsQuery(graphene.ObjectType):
    previews = graphene.List(Shot, args={"taskShotIds": graphene.String()})

    def resolve_previews(parent, info, taskShotIds=None):
        Headers = {"Authorization": info.context.META.get("HTTP_AUTHORIZATION")}
        resp = requests.get(
            "http://0.0.0.0:5000/api/review_tool?taskShotIds=" + taskShotIds,
            headers=Headers,
        )
        print("API resp time=", resp.elapsed.total_seconds())
        if resp.ok:
            return resp.json().get("result")
        else:
            return {"error": "messaage"}
