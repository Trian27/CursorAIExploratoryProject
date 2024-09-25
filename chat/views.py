from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import openai
from django.conf import settings
from django.shortcuts import render
import logging

# Configure logging
logger = logging.getLogger(__name__)

class ChatAPIView(APIView):
    """
    API endpoint that allows users to chat with OpenAI's model.
    """


    '''
    Queries OpenAI API for chat completion
    @param self - The ChatAPIView object
    @param request - The HTTP request containing the user input question and previous message history.
    @returns StreamingHttpResonse with the content of each chunk, in streaming format
    '''
    def post(self, request):
        user_input = request.data.get("input")
        chat_history = request.data.get("messages", [])
        temperature = request.data.get("temperature", 0.0)
        if not user_input:
            return Response({"error": "No input provided"}, status=status.HTTP_400_BAD_REQUEST)
        openai.api_key = settings.OPENAI_API_KEY
        try:
            def generate():
                #Cursor had openai.ChatCompletion.create(...) which is deprecated syntax. It did not have the updated syntax.
                response = openai.chat.completions.create(
                    model="gpt-4o",
                    messages=chat_history + [{"role": "user", "content": user_input}],
                    temperature=temperature,
                    stream=True
                )
                for chunk in response:
                    #Cursor had chunk["choices"][0]["delta"].get("content")... which is deprecated or perhaps even incorrect syntax. It did not have the updated syntax.
                    if (chunk.choices[0].delta.content):
                        yield chunk.choices[0].delta.content

            return StreamingHttpResponse(generate(), content_type="text/plain")
        except Exception as e:
            logger.error(f"Error during OpenAI request: {e}", exc_info=True)
            return Response({"error": "A server error occurred. Please contact the administrator."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def index(request):
    """
    View to render the main chat interface.
    """
    return render(request, "chat/index.html")
