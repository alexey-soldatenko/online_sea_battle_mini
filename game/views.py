from django.shortcuts import render
from django.http import HttpResponse
from game.models import Person, Position, Game, Shoot
from datetime import datetime
from django.views.decorators.csrf import ensure_csrf_cookie
import json

# Create your views here.
@ensure_csrf_cookie
def start_game(request):
	if request.method == 'POST' and request.is_ajax():
		try:
			person_id = request.session['person_id']
			#меняем статус игрока на "ожидающего"
			person = Person.objects.get(person_id = person_id)
			person.status = 'wait'
			person.change_mode_date = datetime.now()
			person.save()

			#создаем модель позиции 
			position_ship, created = Position.objects.get_or_create(person = person)
			
			position_ship.big_ship = request.POST['big_ship']
			position_ship.small_ship = request.POST['small_ship']
			position_ship.save()
			
			
			return HttpResponse('Ожидаем соперника...')
		except Exception as err:
			print(err)
			return HttpResponse('Ожидаем соперника...')


def wait_enemy(request):
	''' функция обновления результатов'''
	if request.method == 'POST' and request.is_ajax():
		try:
			
			person_id = request.session['person_id']
			
			person = Person.objects.get(person_id = person_id)
			
		except Exception as err:	
			print(err)	
			return HttpResponse('Ожидаем соперника.да')

		else:
			if person.status == 'wait':
				
				try:
					#находим соперника
					enemy = Person.objects.filter(status = 'wait').exclude(person_id = person_id).order_by('-change_mode_date')[0]
					
					#создаем игру
					game = Game(person_step = person.person_id, status = 'go')
					game.save()

					#меняем статус на "игроков"
					person.status = 'gamer'
					person.game = game
					person.enemy = enemy
					person.save()

					enemy.status = 'gamer'
					enemy.game = game
					enemy.enemy = person
					enemy.save()
					
					#создаем модель выстрела для двух игроков
					enemy_position = Position.objects.get(person = enemy)
					person_position = Position.objects.get(person = person)

					
					person_shoot, person_created = Shoot.objects.get_or_create(person = person)
					person_shoot.enemy_big_ship = enemy_position.big_ship
					person_shoot.enemy_small_ship = enemy_position.small_ship 
					person_shoot.save()

					
					enemy_shoot, enemy_created = Shoot.objects.get_or_create(person = enemy)
					enemy_shoot.enemy_big_ship = person_position.big_ship
					enemy_shoot.enemy_small_ship = person_position.small_ship 
					enemy_shoot.save()
					
					
					return HttpResponse("Игра началась. Ваш ход.")
				except Exception as err:
					print(err)
					return HttpResponse('Ожидаем соперника...')

			#если статус "игрок"
			elif person.status == 'gamer':
				
				game = person.game
				
				if not game:
					#игра окончена, противник покинул игру
					is_my_step = 'true'
					message = "Противник покинул игру."
					shoots = ' '
					game_is_active = 'false'

					data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active}
					return HttpResponse(json.dumps(data))
				#проверяем активна ли игра (ещё нет победителя)
				if not game.winner:

					#если шаг совпадает с person_id пользователя
					if game.person_step == person.person_id:
						is_my_step = 'true'
						message = "Твой ход, капитан."
						shoots = Shoot.objects.get(person = person.enemy).all_shoots

						game_is_active = 'true'
						data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active}
						return HttpResponse(json.dumps(data))
					else: 
						try:
							#проверяем существует ли ещё противник и участвует ли он в той же игре
							is_enemy = Person.objects.get(person_id = game.person_step)
							if is_enemy.game != game:
								raise Exception
						except:
							is_my_step = 'false'
							message = "Противник покинул игру."
							shoots = Shoot.objects.get(person = person.enemy).all_shoots
							game_is_active = 'false'
							data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active}
							return HttpResponse(json.dumps(data))
						else:
							is_my_step = 'false'
							message = "Ходит противник."
							shoots = Shoot.objects.get(person = person.enemy).all_shoots
							game_is_active = 'true'
							data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active}
							return HttpResponse(json.dumps(data))

				else:
					#если игра окончена, отправляем соответствующее сообщение
					if game.winner == person.person_id:
						is_my_step = 'false'
						message = "Вы победили!"
						shoots = Shoot.objects.get(person = person.enemy).all_shoots
						game_is_active = 'false'
						data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active}
						return HttpResponse(json.dumps(data))
						
					else:
						is_my_step = 'false'
						message = "Вы проиграли."
						shoots = Shoot.objects.get(person = person.enemy).all_shoots
						game_is_active = 'false'
						data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active}
						return HttpResponse(json.dumps(data))
	

def shoot(request):
	''' функция нанесения удара противнику'''

	if request.method == 'POST' and request.is_ajax():
		#определяем пользователя
		person_id = request.session['person_id']
		person = Person.objects.get(person_id = person_id)

		game = person.game

		if not game:
			is_my_step = 'true'
			message = "Противник покинул игру."
			shoots = ' '
			game_is_active = 'false'

			data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active}
			return HttpResponse(json.dumps(data))


		cell = request.POST["cell"]
		
		shoot = Shoot.objects.get(person = person)
		big_ship = shoot.enemy_big_ship.split(',')
		small_ship = shoot.enemy_small_ship
		
		#параметры для отправки пользователю
		is_my_step = 'false'
		message = ""
		shoots = Shoot.objects.get(person = person.enemy).all_shoots
		game_is_active = 'true'
		status = 'past'

		#определяем попал ли пользователь по какому-нибудь кораблю
		if cell in big_ship and len(big_ship) > 1:
			big_ship.remove(cell)
			shoot.enemy_big_ship = big_ship[0]
			if shoot.all_shoots:
				shoot.all_shoots += ','+cell
			else:
				shoot.all_shoots = cell
			game.person_step = person.person_id

			message = 'Вы попали в их корабль'
			is_my_step = 'true'
			status = 'big ship wound'
			


		elif cell in big_ship and len(big_ship) == 1:

			shoot.enemy_big_ship = ''
			if shoot.all_shoots:
				shoot.all_shoots += ','+cell
			else:
				shoot.all_shoots = cell
			game.person_step = person.person_id
			message = 'Вы добили их корабль'
			is_my_step = 'true'
			status = 'big ship kill'
			

		elif cell == small_ship:
			shoot.enemy_small_ship = ''
			if shoot.all_shoots:
				shoot.all_shoots += ','+cell
			else:
				shoot.all_shoots = cell
			game.person_step = person.person_id
			message = 'Вы подбили их лодку'
			is_my_step = 'true'
			status = 'small ship kill'
			
		else:
			if shoot.all_shoots:
				shoot.all_shoots += ','+cell
			else:
				shoot.all_shoots = cell
			game.person_step = person.enemy.person_id
			message = 'На этот раз удача отвернулась от нас'
			

		shoot.save()
		game.save()
		#если значений ячеек расположения кораблей соперника больше нет, следовательно пользователь победил 
		if not shoot.enemy_big_ship and not shoot.enemy_small_ship:
			game.status = 'over'
			game.winner = person.person_id
			game.save()

			message = 'Вы победили'
			game_is_active = 'false'

		
		data = {'is_my_step':is_my_step, 'message': message, 'shoots': shoots, 'game_is_active': game_is_active, 'status': status}
		return HttpResponse(json.dumps(data))

		




