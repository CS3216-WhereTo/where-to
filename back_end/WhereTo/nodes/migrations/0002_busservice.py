# Generated by Django 3.2.7 on 2021-09-16 14:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('nodes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusService',
            fields=[
                ('edge_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='nodes.busedge')),
                ('service', models.CharField(max_length=5)),
            ],
        ),
    ]