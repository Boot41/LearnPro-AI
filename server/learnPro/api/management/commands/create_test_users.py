from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users'

    def handle(self, *args, **kwargs):
        # Create first test user
        user1, created1 = User.objects.get_or_create(
            username='test1',
            email='test1@learnpro.ai',
            defaults={
                'is_staff': True,
            }
        )
        if created1:
            user1.set_password('test1pass')
            user1.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user1.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {user1.email}'))

        # Create second test user
        user2, created2 = User.objects.get_or_create(
            username='test2',
            email='test2@learnpro.ai',
            defaults={
                'is_staff': False,
            }
        )
        if created2:
            user2.set_password('test2pass')
            user2.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user2.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {user2.email}'))
