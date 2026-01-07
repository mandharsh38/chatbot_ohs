from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MCQ, TrainingModule
import json
import random
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import re

# Create your views here.

def index(request):
    return render(request, 'chatbot/index.html')

@csrf_exempt

def get_module_content(request, module_id):
    """
    Returns module content as structured JSON for the chatbot.
    Example: /api/module/1/content/
    """
    module = get_object_or_404(TrainingModule, pk=module_id)
    content_text = module.content_text.strip()

    try:
        # If content_text itself is valid JSON, parse it
        data = json.loads(content_text)
        if isinstance(data, list):
            return JsonResponse(data, safe=False)
        elif isinstance(data, dict):
            return JsonResponse([data], safe=False)
    except json.JSONDecodeError:
        # Not JSON — fallback to paragraph split
        response_data = []
        if module.image_url:
            response_data.append({"type": "image", "value": module.image_url})
        for p in content_text.split("\n"):
            if p.strip():
                response_data.append({"type": "text", "value": p.strip()})
        return JsonResponse(response_data, safe=False)
    
def start_test(request, module_id):
    try:
        module = TrainingModule.objects.get(id=module_id)
    except TrainingModule.DoesNotExist:
        return JsonResponse({"error": "Module not found"}, status=404)

    # Fetch MCQs for this module
    questions = MCQ.objects.filter(module=module).values(
        'id', 'question_text', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'correct_choice'
    )
    questions = list(questions)
    
    random.shuffle(questions)
    question_list = questions[:20]

    # Transform into JS-friendly structure
    formatted_questions  = []
    for q in question_list:
        formatted_questions.append({
            "id": q['id'],
            "question": q['question_text'],
            "options": [q['choice_a'], q['choice_b'], q['choice_c'], q['choice_d']],
            "correct": q['correct_choice']
        })

    return JsonResponse(formatted_questions, safe=False)

# model for POSH training module

from huggingface_hub import login
login("hf key heree plissss")

# Load Phi-3-mini once at startup
# MODEL_ID = "microsoft/phi-3-mini-4k-instruct"
MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct"
# MODEL_ID = "openlm-research/open_llama_3b_v2"

print("Loading model...")

# tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, use_fast=False)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.float16,
    load_in_4bit=True,
    device_map="auto"
)
generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=150,
    temperature=0.3,
    top_p=0.9,
)

# System prompt for POSH training
SYSTEM_PROMPT = """
You are a professional HR assistant specialized in the Prevention of Sexual Harassment (POSH) Act, 2013 in India.
Answer the following question concisely and factually.
Do NOT ask follow-up questions, give advice, or continue the conversation.
If you don't know the answer, say you don't know.
"""


@csrf_exempt
def ask_question(request, module_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        data = json.loads(request.body)
        question = data.get("question", "").strip()
        if not question:
            return JsonResponse({"error": "Empty question"}, status=400)
        
        print(f"Question asked for module {module_id}: {question}")
        
        prompt = f"{SYSTEM_PROMPT}\n\nQuestion: {question}\nAnswer:"
        # prompt = question
        
        print(f"Prompt: {prompt}")
        
        result = generator(prompt)[0]["generated_text"]
        
        print(f"Result: {result}")
        
        answer = result.split("Answer:")[-1].strip()
        answer = answer.split("\n\n")[0].strip()
        
        if answer == "I don't know.":
            answer = f"We regret that your query '{question}' falls outside the scope, \n  Our AI chatbot is continuously improving to broaden its capabilities"

        # match = re.search(r"Answer:\s*(.*?)(?:\nQuestion:|$)", result, re.DOTALL)
        # if match:
        #     answer = match.group(1).strip()
        #     # Step 2: Remove all "Document:" prefixes
        #     answer = re.sub(r'\bDocument:\s*', '', answer, flags=re.IGNORECASE)
        #     # Step 3: Clean extra blank lines
        #     answer = "\n".join(line.strip() for line in answer.splitlines() if line.strip())

        return JsonResponse({"answer": answer})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)