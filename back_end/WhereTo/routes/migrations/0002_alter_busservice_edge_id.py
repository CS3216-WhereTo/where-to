# Generated by Django 3.2.7 on 2021-09-19 20:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('routes', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='busservice',
            name='edge_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='routes.busedge'),
        ),
    ]
