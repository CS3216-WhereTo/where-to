# Generated by Django 3.2.7 on 2021-09-17 17:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('nodes', '0004_auto_20210918_0105'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Favourite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('node_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nodes.node')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
            ],
        ),
        migrations.AddConstraint(
            model_name='favourite',
            constraint=models.UniqueConstraint(fields=('user_id', 'node_id'), name='user can only favourite a node once'),
        ),
    ]