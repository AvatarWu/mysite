from django.shortcuts import render
from .models import Post
# trips/views.py

# from django.http import HttpResponse
from datetime import datetime
from django.shortcuts import render

def hello_world(request):
    return render(request, 'hello_world.html', {
        'current_time': str(datetime.now()),
    })
    
def home(request):
    post_list = Post.objects.all()
    return render(request, 'home.html', {
        'post_list': post_list,
    })