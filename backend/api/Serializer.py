# serializers.py
from rest_framework import serializers
from .models import User, Role, Case, CaseImage

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role_id = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), source='role')
    role_name = serializers.CharField(source='role.name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'fname',
            'lname',
            'role_id',
            'role_name',
            'last_login',
            'is_active',
            'is_staff',
            'is_superuser',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class CaseImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseImage
        fields = ['id', 'image']

class CaseSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Case
        fields = [
            'title',
            'description',
            'reporter',
            'created_by',
            'case_type',
            'status',
            'location',
            'images',
        ]

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        case = Case.objects.create(**validated_data)
        for img in images:
            CaseImage.objects.create(case=case, image=img)
        return case

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__' 