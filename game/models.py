from django.db import models

# Create your models here.
class Game(models.Model):
	person_step = models.PositiveSmallIntegerField()
	status = models.CharField(max_length=20)
	winner = models.PositiveSmallIntegerField(blank=True, null=True)

class Person(models.Model):
	person_id = models.PositiveSmallIntegerField(unique=True)
	status = models.CharField(max_length=50)
	change_mode_date = models.DateTimeField()
	last_action_date = models.DateTimeField(auto_now=True)
	game = models.ForeignKey(Game, blank=True, null=True, on_delete = models.SET_NULL)
	enemy = models.ForeignKey('self', blank=True, null=True, on_delete = models.SET_NULL)

	def delete(self, *args, **kwargs):
		if self.game:
			self.game.delete()
		super(Person, self).delete(*args, **kwargs)


class Position(models.Model):
	person = models.OneToOneField(Person)
	big_ship = models.CharField(max_length=10)
	small_ship = models.CharField(max_length=5)


class Shoot(models.Model):
	person = models.OneToOneField(Person)
	enemy_big_ship = models.CharField(max_length=10)
	enemy_small_ship = models.CharField(max_length=5)
	all_shoots = models.CharField(max_length=50, blank=True, null=True)