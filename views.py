from django.shortcuts import render
from django.http import HttpResponse
from game.models import Person
import datetime
from django.views.decorators.csrf import ensure_csrf_cookie


def main_page(request):
	
	try:
		old_person_id = request.session['person_id']	
		
		last_id = Person.objects.latest('id').person_id
		
		new_id = last_id+1
		try:
			delete_person = Person.objects.get(person_id = old_person_id).delete()
		except:
			pass
		print(new_id)
		person = Person(person_id = new_id, change_mode_date = datetime.datetime.now(), status = 'watcher')
		person.save()
		request.session["person_id"] = new_id
		request.session.set_expiry(200)
		request.session.save()	
		print(1)
	except (KeyError, Person.DoesNotExist):

		try:
			last_id = Person.objects.latest('id').person_id
			print(last_id)
			new_id = last_id+1
			person = Person(person_id = new_id, change_mode_date = datetime.datetime.now(), status = 'watcher')
			person.save()
			request.session["person_id"] = new_id
			request.session.set_expiry(200)
			request.session.save()
			print(2)
		except Exception as err:
			print(err)
			person = Person(person_id = 1000, change_mode_date = datetime.datetime.now(), status = 'watcher')
			person.save()
			request.session["person_id"] = 1000
			request.session.set_expiry(200)
			request.session.save()
			print(3)
	'''except Person.DoesNotExist:
		person_id = request.session['person_id']
		print(person_id)
		person =  Person(person_id = person_id, change_mode_date = datetime.datetime.now(), status = 'watcher')
		person.save()

		request.session.set_expiry(200)
		request.session.save()	
		print(4)'''
	return render(request, 'index.html')


def extention_of_session(request):
	if request.method == 'POST' and request.is_ajax():
		try:
			request.session.set_expiry(200)
			request.session.save()

			person_id = request.session["person_id"]
			person = Person.objects.get(person_id = person_id)
			person.last_action_date = datetime.datetime.now()
			person.save()
		except Exception as err:
			print(err)
			return HttpResponse('ok')
		return HttpResponse('ok')

