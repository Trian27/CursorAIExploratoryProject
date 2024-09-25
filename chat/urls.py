from django.urls import path
from .views import ChatAPIView, index

urlpatterns = [
    #This calls the view
    path("chat/", ChatAPIView.as_view(), name="chat"),
    path("", index, name="index"),
]
