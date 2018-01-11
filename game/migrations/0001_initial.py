# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('person_step', models.PositiveSmallIntegerField()),
                ('status', models.CharField(max_length=20)),
                ('winner', models.PositiveSmallIntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('person_id', models.PositiveSmallIntegerField(unique=True)),
                ('status', models.CharField(max_length=50)),
                ('change_mode_date', models.DateTimeField()),
                ('last_action_date', models.DateTimeField(auto_now=True)),
                ('enemy', models.ForeignKey(null=True, blank=True, to='game.Person', on_delete=django.db.models.deletion.SET_NULL)),
                ('game', models.ForeignKey(null=True, blank=True, to='game.Game')),
            ],
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('big_ship', models.CharField(max_length=10)),
                ('small_ship', models.CharField(max_length=5)),
                ('person', models.OneToOneField(to='game.Person')),
            ],
        ),
        migrations.CreateModel(
            name='Shoot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enemy_big_ship', models.CharField(max_length=10)),
                ('enemy_small_ship', models.CharField(max_length=5)),
                ('all_shoots', models.CharField(max_length=50, blank=True, null=True)),
                ('person', models.OneToOneField(to='game.Person')),
            ],
        ),
    ]
