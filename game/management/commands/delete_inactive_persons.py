from django.core.management.base import BaseCommand, CommandError
from game.models import Person
import datetime

class Command(BaseCommand):

	def handle(self, *args, **kwargs):
		try:
			date_now = datetime.datetime.now()
			three_minute = date_now - datetime.timedelta(minutes = 3)
			
			persons_inactive = Person.objects.filter(last_action_date__lt = three_minute)
			print('delete is ', persons_inactive.count())
			
			persons_inactive.delete()
		except Exception as err:
			print(err)
