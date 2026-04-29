from django.db import models

class Usuario(models.Model):
    nombre=models.CharField(max_length=250)
    apellido=models.CharField(max_length=250)
    dni=models.CharField(max_length=8)

    def __str__(self):
        return f"{self.nombre} + {self.apellido} + {self.dni}"
