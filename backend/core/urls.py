from django.urls import path
from api.views import HelloWorldView,UserListView,LoginView,CaseCreateAPIView,CaseListView,CaseColumns,ExportSelectedColumns,ForgotPasswordView,ResetPasswordView,UserCreateView,RoleView,UsersByRoleView,TodayCasesByStatusView,CasetyView,TodayCasesByTypeView


urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello-world'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('login/', LoginView.as_view(), name='user-list'),
    path('create/cases/', CaseCreateAPIView.as_view(), name='case-create'),
    path('case/list/', CaseListView.as_view(), name='event-list'),
    path('case/columns/', CaseColumns.as_view(), name='event-columns'),
    path('case/export/', ExportSelectedColumns.as_view(), name='export-selected-columns'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(),   name='reset-password'),
    path('users/create/', UserCreateView.as_view(), name='user-create'),
    path('roles/', RoleView.as_view(), name='roleuser'),
    path('cases/today-by-status/', TodayCasesByStatusView.as_view(), name='today-cases-by-status'),
    path('users/by-role/', UsersByRoleView.as_view(), name='users-by-role'),
    path('case/type/', CasetyView.as_view(), name='-case_ty'),
    path('cases/today-by-type/', TodayCasesByTypeView.as_view(), name='today-cases-by-type'),

]

