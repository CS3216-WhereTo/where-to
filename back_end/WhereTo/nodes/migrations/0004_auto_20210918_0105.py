# Generated by Django 3.2.7 on 2021-09-17 17:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('nodes', '0003_alter_busservice_edge_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='walkedge',
            name='end_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='walk_end', to='nodes.node'),
        ),
        migrations.AlterField(
            model_name='walkedge',
            name='start_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='walk_start', to='nodes.node'),
        ),
    ]
