# filepath: /workspaces/codespaces-django/hello_world/migrations/0002_initial_data.py
from django.db import migrations

def create_initial_data(apps, schema_editor):
    Rival = apps.get_model('hello_world', 'Rival')
    Rival.objects.create(name='Mike', svp_count=0, mvp_count=0)
    Rival.objects.create(name='Alex', svp_count=0, mvp_count=0)
    Rival.objects.create(name='Mario', svp_count=0, mvp_count=0)
    Rival.objects.create(name='Pat', svp_count=0, mvp_count=0)

class Migration(migrations.Migration):

    dependencies = [
        ('hello_world', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_data),
    ]