from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.utils.timezone import now
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login
from api.Serializer import UserSerializer, RoleSerializer, CaseSerializer, CaseSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.dateparse import parse_datetime,parse_date
from api.models import Case, User, Role, CaseType
from rest_framework import generics, status
from django.contrib.auth.password_validation import validate_password, ValidationError as DjangoValidationError
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.views.decorators.csrf import ensure_csrf_cookie

@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        print(request.user.id)
        username = request.data.get('username')
        password = request.data.get('password')
        rememberMe = request.data.get('rememberMe')
        print(username, password, rememberMe)

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        print(type(user))
        print(user.id)
        if user is not None:
            login(request, user)
            print(request.auth)
            if rememberMe:
                request.session.set_expiry(1209600)
            else:
                request.session.set_expiry(0)

            serializer = UserSerializer(user)
            return Response({"message": "Login successful", "user": serializer.data})
        else:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)


class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello, World!"})
    
class UserListView(APIView):
    def get(self, request):
        users = User.objects.select_related('role').all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class CaseCreateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        try:
            print(f"Request data: {request.data}")
            print(f"User authenticated: {request.user.is_authenticated}")
            print(f"User: {request.user}")
            print(request.data.get('caseType'))
            print( request.data.get('description'))
            # Handle multiple images
            images = request.FILES.getlist('images', [])
            print(f"Images received: {len(images)}")
            
            serializer_data = {
                'title': request.data.get('caseTitle'),
                'description': request.data.get('description'),
                'reporter': int(request.data.get('userId')),  # Use from request or default
                'location': request.data.get('location'),
                'status': request.data.get('status', 1),  # Default status
                'images': images,
                'case_type': int(request.data.get('caseType')),
            }
            
            print(f"Serializer data: {serializer_data}")
            
            serializer = CaseSerializer(data=serializer_data)
            
            if serializer.is_valid():
                case = serializer.save()
                return Response(
                    {
                        "message": "Case created successfully", 
                        "data": serializer.data,
                        "case_id": case.id
                    },
                    status=status.HTTP_201_CREATED
                )
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response(
                    {
                        "message": "Failed to create case", 
                        "errors": serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            print(f"Exception in CaseCreateAPIView: {str(e)}")
            return Response(
                {
                    "message": "An error occurred while creating the case",
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
 
class CaseListView(APIView):
    def get(self, request):
        start = request.GET.get('start')
        end = request.GET.get('end')
        if not (start and end):
            return Response({'error': 'start and end parameters are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        start_time = parse_datetime(start)
        end_time = parse_datetime(end)

        cases = Case.objects.filter(created_at__range=(start_time, end_time)).values('title', 'created_at')
        return Response(list(cases))

class CaseColumns(APIView):
    def get(self, request):
        # ดึง field name ทั้งหมดจาก model
        columns = [
            {"key": field.name, "label": field.name.replace('_', ' ').title()}
            for field in Case._meta.fields
        ]
        return Response(columns)

class ExportSelectedColumns(APIView):
    def post(self, request):
        columns = request.data.get('columns', [])
        start = request.data.get('start')
        end = request.data.get('end')

        if not columns:
            return Response({'error': 'columns are required'}, status=status.HTTP_400_BAD_REQUEST)

        valid_fields = {field.name for field in Case._meta.fields}
        invalid_fields = [c for c in columns if c not in valid_fields]
        if invalid_fields:
            return Response({'error': f'Invalid columns: {invalid_fields}'}, status=status.HTTP_400_BAD_REQUEST)

        queryset = Case.objects.all()

        if start and end:
            start_dt = parse_datetime(start)
            end_dt = parse_datetime(end)
            if not start_dt or not end_dt:
                return Response({'error': 'Invalid start or end datetime format'}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(created_at__range=(start_dt, end_dt))

        events = queryset.values(*columns)
        return Response(list(events))

    

class ForgotPasswordView(APIView):

    def post(self, request):
        username = request.data.get('username')
        print(username)
        if not username:
            return Response(
                {"detail": "กรุณาส่งชื่อผู้ใช้มา"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            User.objects.get(username=username)
            return Response(
                {"detail": "พบชื่อผู้ใช้ในระบบ"},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "ไม่พบชื่อผู้ใช้"},
                status=status.HTTP_404_NOT_FOUND
            )
        
class ResetPasswordView(APIView):

    def post(self, request):
        username    = request.data.get('username')
        new_password = request.data.get('new_password')  # or 'newPassword' to match your frontend
        if not username or not new_password:
            return Response(
                {"detail": "กรุณาส่งชื่อผู้ใช้และรหัสผ่านใหม่มา"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"detail": "ไม่พบชื่อผู้ใช้"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate password strength
        try:
            validate_password(new_password, user)
        except DjangoValidationError as e:
            print(e.messages)
            return Response(
                {"detail": e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )

        # All good — set and save the new password
        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "รีเซ็ตรหัสผ่านสำเร็จ"},
            status=status.HTTP_200_OK
        )
        
class UserCreateView(generics.CreateAPIView):
    def post(self, request):
            serializer = UserSerializer(data=request.data)
            print(request.data)
            
            if serializer.is_valid():
                user = serializer.save()
                return Response({"message": "User created successfully", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoleView(APIView):
    def get(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)
    
class UsersByRoleView(APIView):
    def get(self, request):
        users_by_role = (
            User.objects.values('role__name')
            .annotate(count=Count('id'))
            .order_by('role__name')
        )

        result = [
            {"role": item["role__name"] or "No Role", "count": item["count"]}
            for item in users_by_role
        ]
        return Response({"usersByRole": result})


class TodayCasesByStatusView(APIView):
    def get(self, request):
        today = now().date()
        cases_today = (
            Case.objects.filter(created_at__date=today)
            .values('status__name')
            .annotate(count=Count('id'))
            .order_by('status__name')
        )

        result = [
            {"status": item["status__name"] or "Unknown", "count": item["count"]}
            for item in cases_today
        ]
        return Response({"todayCasesByStatus": result})
    
class CasetyView(APIView):
    def get(self, request):
        roles = CaseType.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)