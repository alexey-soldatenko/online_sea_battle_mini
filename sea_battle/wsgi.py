"""
WSGI config for sea_battle project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sea_battle.settings")

application = get_wsgi_application()

import subprocess
import os
from django.conf import settings 




path_to_manage = os.path.join(settings.BASE_DIR, 'manage.py')
path_to_cron = os.path.join(settings.BASE_DIR, 'cron_task.txt')
general_dir = os.path.dirname(settings.BASE_DIR)

#для virtualenv
value = '*/3 * * * * {0}/myvenv/bin/python {1} delete_inactive_persons > {2}/out.txt\n'.format(general_dir, path_to_manage, settings.BASE_DIR)

#value = '*/3 * * * * python3 {0} {1}\n'.format(path_to_manage, path_to_cron)
with open(path_to_cron, 'w') as cron_file:
	cron_file.write(value)
	
	

command = subprocess.run(['crontab', path_to_cron])
