from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    # url(r'^$', 'sea_battle.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'views.main_page'),
    url(r'^start_game$', 'game.views.start_game'),
    url(r'^wait_enemy$', 'game.views.wait_enemy'),
    url(r'^time_action$', 'views.extention_of_session'),
    url(r'^shoot$', 'game.views.shoot'),
]
