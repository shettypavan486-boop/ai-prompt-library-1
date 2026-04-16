import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError

from .models import Prompt

try:
    import redis
    redis_client = redis.Redis(
        host='redis',
        port=6379,
        db=0,
        decode_responses=True
    )
except Exception:
    redis_client = None


@csrf_exempt
def prompt_list(request):
    if request.method == "GET":
        prompts = list(
            Prompt.objects.all()
            .order_by("-created_at")
            .values("id", "title", "complexity", "created_at")
        )
        return JsonResponse(prompts, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)

            prompt = Prompt(
                title=data.get("title", "").strip(),
                content=data.get("content", "").strip(),
                complexity=data.get("complexity")
            )

            prompt.full_clean()
            prompt.save()

            return JsonResponse(
                {
                    "id": prompt.id,
                    "title": prompt.title,
                    "content": prompt.content,
                    "complexity": prompt.complexity,
                    "created_at": prompt.created_at.isoformat(),
                },
                status=201
            )

        except ValidationError as e:
            return JsonResponse({"errors": e.message_dict}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def prompt_detail(request, id):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        prompt = Prompt.objects.get(id=id)

        view_count = 0

        if redis_client:
            try:
                key = f"prompt:{id}:views"
                view_count = redis_client.incr(key)
            except Exception:
                view_count = 0

        data = {
            "id": prompt.id,
            "title": prompt.title,
            "content": prompt.content,
            "complexity": prompt.complexity,
            "created_at": prompt.created_at.isoformat(),
            "view_count": view_count
        }

        return JsonResponse(data)

    except Prompt.DoesNotExist:
        return JsonResponse({"error": "Prompt not found"}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)