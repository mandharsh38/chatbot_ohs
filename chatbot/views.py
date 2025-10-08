from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

def index(request):
    return render(request, 'chatbot/index.html')

@csrf_exempt
def chatbot_api(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_message = data.get("message", "")

        # Your chatbot logic / response
        # For now, simple echo example:
        
        bot_response = f"You said: {user_message}"

        return JsonResponse({"response": bot_response})

    return JsonResponse({"error": "Invalid request"}, status=400)