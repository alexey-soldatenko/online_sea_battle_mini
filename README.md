# online_sea_battle_mini
Игра мини морской бой представляет собой упрощенную версию этой игры в онлайн режиме. Игра происходит между двумя игроками до победы или до выхода одного из соперников из игры.

Приложение написано на python3/Django1.8

Приложение запускается как обычный Django-проект, т.е. python3 manage.py runserver

В проекте предусмотрена работа cron, который каждые 3 мин. запускает команду для проверки активных игоков. Если вы запускаете проект из virtualenv указывайте точный путь к интерпретатору python (см. sea_battle/wsgi.py).

Для проверки используйте два разных браузера.