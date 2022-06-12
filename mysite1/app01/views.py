from django.shortcuts import render, HttpResponse, redirect


# Create your views here.
def index(request):
    return HttpResponse("欢迎使用")

def user_list(request):
    return render(request, "user_list.html")

def user_add(request):
    return HttpResponse("添加用户")

def tpl(request):
    name = "韩超"
    roles=["管理员", "CEO", "保安"]
    user_info = {"name": "LEE", "age": 18}
    return render(request, "tpl.html", {"n1": name,
                                        "n2": roles,
                                        "n3": user_info})
def news(request):

    return render(request, 'news.html')

def something(request):
    print(request.method)
    print(request.GET)
    print(request.POST)

    # HttpResponse 将字符串内容返还给请求者
    return redirect("./news/")

def login(request):
    if request.method == "POST":
        print(request.POST)
        return HttpResponse("登陆成功")
    else:
        return render(request, "login.html")