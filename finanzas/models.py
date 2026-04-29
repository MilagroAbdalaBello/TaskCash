from django.db import models

class Movimiento(models.Model):
    TIPO_CHOICES=[
        ('ING', 'Ingreso'),
        ('EGRE', 'Egreso'),
    ]

    monto=models.DecimalField(max_digits=12, decimal_places=2)
    concepto=models.CharField(max_length=250) #Ejemplo: "Compra de tira de pan"
    metodo_pago=models.CharField(max_length=50, default='Efectivo') #Sino dice de que forma fue el pago, se pone en Efectivo
    fecha=models.DateTimeField(auto_now_add=True)
    tipo=models.CharField(max_length=4, choices=TIPO_CHOICES)

    def __str__(self):
        return f"{self.concepto} - ${self.monto}"


    

